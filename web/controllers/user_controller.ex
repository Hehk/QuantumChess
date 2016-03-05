defmodule QuantumChess.UserController do
  use QuantumChess.Web, :controller
  plug :authenticate when action in [:index, :show]

  alias QuantumChess.User

  plug :scrub_params, "user" when action in [:update]

  def index(conn, _params) do
    users = Repo.all(User)
    render(conn, "index.html", users: users)
  end

  def new(conn, _params) do
    changeset = User.changeset(%User{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"new_user" => %{"username" => user, "password_hash" => password, "email" => email}}) do
    params = %{username: user, password_hash: password, email: email}
    changeset = User.registration_changeset(%User{}, params)
    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> QuantumChess.Auth.login(user)
        |> put_flash(:info, "#{user.username} created!")
        |> redirect(to: page_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "testing")
        |> create_errors(changeset)
        |> redirect(to: "/sign-up")
    end
  end

  def create_errors(conn, changeset) do
    changeset.errors
    |> Enum.reduce(conn,
      fn
        ({:password_hash, _error}, new_conn) ->
          put_flash(new_conn, :error_password, "Passwords must have a at least 6 characters!")
        ({:username, _error}, new_conn)      ->
          put_flash(new_conn, :error_username, "Usernames must have a at least 3 characters!")
      end)
  end

  def show(conn, %{"id" => id}) do
    user = Repo.get!(User, id)
    render(conn, "show.html", user: user)
  end

  def edit(conn, %{"id" => id}) do
    user = Repo.get!(User, id)
    changeset = User.registration_changeset(user)
    render(conn, "edit.html", user: user, changeset: changeset)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Repo.get!(User, id)
    changeset = User.registration_changeset(user, user_params)

    case Repo.update(changeset) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "User updated successfully.")
        |> redirect(to: user_path(conn, :show, user))
      {:error, changeset} ->
        render(conn, "edit.html", user: user, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Repo.get!(User, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(user)

    conn
    |> put_flash(:info, "User deleted successfully.")
    |> redirect(to: user_path(conn, :index))
  end

  defp authenticate(conn, _opts) do
    if conn.assigns.current_user do
      conn
    else
      conn
      |> put_flash(:error, "You must be logged in to access that page")
      |> redirect(to: page_path(conn, :index))
      |> halt()
    end
  end
end

defmodule QuantumChess.GameController do
  use QuantumChess.Web, :controller

  alias QuantumChess.Game

  plug :scrub_params, "game" when action in [:create, :update]

  defmodule Tile do
    defstruct piece: " ", color: 0
  end
  def create_new_board() do
    [ [ %Tile{piece: "r"}, %Tile{piece: "n"}, %Tile{piece: "b"}, %Tile{piece: "q"},
        %Tile{piece: "k"}, %Tile{piece: "b"}, %Tile{piece: "n"}, %Tile{piece: "r"} ],
      [ %Tile{piece: "p"}, %Tile{piece: "p"}, %Tile{piece: "p"}, %Tile{piece: "p"},
        %Tile{piece: "p"}, %Tile{piece: "p"}, %Tile{piece: "p"}, %Tile{piece: "p"} ],
      [ %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{} ],
      [ %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{} ],
      [ %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{} ],
      [ %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{}, %Tile{} ],
      [ %Tile{piece: "p", color: 1}, %Tile{piece: "p", color: 1}, %Tile{piece: "p", color: 1},
        %Tile{piece: "p", color: 1}, %Tile{piece: "p", color: 1}, %Tile{piece: "p", color: 1},
        %Tile{piece: "p", color: 1}, %Tile{piece: "p", color: 1} ],
      [ %Tile{piece: "r", color: 1}, %Tile{piece: "n", color: 1}, %Tile{piece: "b", color: 1},
        %Tile{piece: "q", color: 1}, %Tile{piece: "k", color: 1}, %Tile{piece: "b", color: 1},
        %Tile{piece: "n", color: 1}, %Tile{piece: "r", color: 1} ] ]
  end

  def index(conn, _params) do
    board = create_new_board
    render(conn, "index.html", board: board)
  end

  def new(conn, _params) do
    changeset = Game.changeset(%Game{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"game" => game_params}) do
    changeset = Game.changeset(%Game{}, game_params)

    case Repo.insert(changeset) do
      {:ok, _game} ->
        conn
        |> put_flash(:info, "Game created successfully.")
        |> redirect(to: game_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    game = Repo.get!(Game, id)
    render(conn, "show.html", game: game)
  end

  def edit(conn, %{"id" => id}) do
    game = Repo.get!(Game, id)
    changeset = Game.changeset(game)
    render(conn, "edit.html", game: game, changeset: changeset)
  end

  def update(conn, %{"id" => id, "game" => game_params}) do
    game = Repo.get!(Game, id)
    changeset = Game.changeset(game, game_params)

    case Repo.update(changeset) do
      {:ok, game} ->
        conn
        |> put_flash(:info, "Game updated successfully.")
        |> redirect(to: game_path(conn, :show, game))
      {:error, changeset} ->
        render(conn, "edit.html", game: game, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    game = Repo.get!(Game, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(game)

    conn
    |> put_flash(:info, "Game deleted successfully.")
    |> redirect(to: game_path(conn, :index))
  end
end

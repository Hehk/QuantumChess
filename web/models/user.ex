defmodule QuantumChess.User do
  use QuantumChess.Web, :model

  schema "users" do
    field :username, :string
    field :email, :string
    field :password_hash, :string
    field :wins, :integer, default: 0
    field :losses, :integer, default: 0
    field :elo, :integer, default: 1000
    has_many :game_move, QuantumChess.GameMove

    timestamps
  end

  @required_fields ~w(username email password_hash wins losses elo)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def registration_changeset(model, params) do
    model
    |> changeset(params)
    |> cast(params, ~w(password_hash), [])
    |> validate_length(:password_hash, min: 6, max: 100)
    |> validate_length(:username, min: 3)
    |> put_pass_hash()
  end

  # Changes the password into a hashed version
  defp put_pass_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password_hash: pass}} ->
        put_change(changeset, :password_hash, Comeonin.Bcrypt.hashpwsalt(pass))
      _ ->
        changeset
    end
  end
end

defmodule QuantumChess.User do
  use QuantumChess.Web, :model

  schema "users" do
    field :username, :string
    field :email, :string
    field :password_hash, :string
    field :wins, :integer, default: 0
    field :losses, :integer, default: 0
    field :elo, :integer, default: 1000

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
    IO.inspect params

    model
    |> cast(params, @required_fields, @optional_fields)
  end
end

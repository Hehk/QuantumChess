defmodule QuantumChess.User do
  use QuantumChess.Web, :model

  schema "users" do
    field :username, :string
    field :email, :string
    field :password_hash, :string
    field :wins, :integer
    field :losses, :integer
    field :elo, :integer

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
end

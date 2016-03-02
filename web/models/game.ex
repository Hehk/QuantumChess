defmodule QuantumChess.Game do
  use QuantumChess.Web, :model

  schema "game" do
    field :player_1, :integer
    field :player_2, :integer
    field :winner, :integer

    timestamps
  end

  @required_fields ~w(player_1 player_2)
  @optional_fields ~w(winner)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(params \\ :empty) do
    %{}
    |> cast(params, @required_fields, @optional_fields)
  end
end

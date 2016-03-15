defmodule QuantumChess.FinishedGame do
  use QuantumChess.Web, :model

  schema "finished_games" do
    field :winner, :string
    field :loser, :string
    field :game_id, :string

    timestamps
  end

  @required_fields ~w(winner loser game_id)
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

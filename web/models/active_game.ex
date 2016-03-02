defmodule QuantumChess.ActiveGame do
  use QuantumChess.Web, :model

  schema "active_games" do
    field :player_1, :string
    field :player_2, :string
    field :active_player, :string
    field :game_id, :string

    timestamps
  end

  @required_fields ~w(player_1 player_2 active_player game_id)
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

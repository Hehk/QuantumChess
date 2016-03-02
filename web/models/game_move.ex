defmodule QuantumChess.GameMove do
  use QuantumChess.Web, :model

  schema "game_move" do
    field :game_id, :string
    field :start_position, :integer
    field :end_position, :integer
    field :order, :integer
    belongs_to :user, QuantumChess.User

    timestamps
  end

  @required_fields ~w(game_id start_position end_position order)
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

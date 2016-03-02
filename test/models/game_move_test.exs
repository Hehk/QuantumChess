defmodule QuantumChess.GameMoveTest do
  use QuantumChess.ModelCase

  alias QuantumChess.GameMove

  @valid_attrs %{end_position: 42, game_id: "some content", order: 42, start_position: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GameMove.changeset(%GameMove{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GameMove.changeset(%GameMove{}, @invalid_attrs)
    refute changeset.valid?
  end
end

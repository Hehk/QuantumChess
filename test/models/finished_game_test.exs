defmodule QuantumChess.FinishedGameTest do
  use QuantumChess.ModelCase

  alias QuantumChess.FinishedGame

  @valid_attrs %{game_id: "some content", loser: "some content", winner: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = FinishedGame.changeset(%FinishedGame{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = FinishedGame.changeset(%FinishedGame{}, @invalid_attrs)
    refute changeset.valid?
  end
end

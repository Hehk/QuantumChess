defmodule QuantumChess.GameTest do
  use QuantumChess.ModelCase

  alias QuantumChess.Game

  @valid_attrs %{player_1: "some content", player_2: "some content", winner: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Game.changeset(%Game{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Game.changeset(%Game{}, @invalid_attrs)
    refute changeset.valid?
  end
end

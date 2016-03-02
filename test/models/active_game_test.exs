defmodule QuantumChess.ActiveGameTest do
  use QuantumChess.ModelCase

  alias QuantumChess.ActiveGame

  @valid_attrs %{active_player: "some content", game_id: "some content", player_1: "some content", player_2: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = ActiveGame.changeset(%ActiveGame{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = ActiveGame.changeset(%ActiveGame{}, @invalid_attrs)
    refute changeset.valid?
  end
end

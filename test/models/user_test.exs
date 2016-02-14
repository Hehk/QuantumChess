defmodule QuantumChess.UserTest do
  use QuantumChess.ModelCase

  alias QuantumChess.User

  @valid_attrs %{elo: 42, email: "some content", losses: 42, password_hash: "some content", username: "some content", wins: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end

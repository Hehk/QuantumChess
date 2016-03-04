defmodule QuantumChess.GameView do
  use QuantumChess.Web, :view

  def create_tile_class(color) do
    "tile color-" <> to_string(color)
  end

  def create_tile_type(piece) when piece === " ", do: "empty"
  def create_tile_type(piece), do: piece

  def create_game_link(game_id) when is_bitstring(game_id) do
    "game?=" <> game_id
  end
  def create_game_link(_), do: "/"
end

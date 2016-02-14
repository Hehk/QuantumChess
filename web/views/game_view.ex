defmodule QuantumChess.GameView do
  use QuantumChess.Web, :view

  def create_tile_class(color) do
    "tile color-" <> to_string(color)
  end

  def create_tile_type(piece) when piece === " ", do: "empty"
  def create_tile_type(piece), do: piece
end

defmodule QuantumChess.GameView do
  use QuantumChess.Web, :view

  def create_tile_class(tile) do
    "tile color-" <> to_string(tile.color) <> " " <> get_piece_name(tile.piece)
  end

  def get_piece_name(piece) when piece == " ", do: ""
  def get_piece_name(piece) when piece == "p", do: "pawn"
  def get_piece_name(piece) when piece == "r", do: "rook"
  def get_piece_name(piece) when piece == "b", do: "bishop"
  def get_piece_name(piece) when piece == "n", do: "knight"
  def get_piece_name(piece) when piece == "k", do: "king"
  def get_piece_name(piece) when piece == "q", do: "queen"

  def create_tile_type(piece) when piece === " ", do: "empty"
  def create_tile_type(piece), do: piece

  def create_game_link(game_id) when is_bitstring(game_id) do
    "game?=" <> game_id
  end
  def create_game_link(_), do: "/"
end

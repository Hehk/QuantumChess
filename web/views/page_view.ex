defmodule QuantumChess.PageView do
  use QuantumChess.Web, :view

  import Ecto.Query

  def create_title(game) do
    game.player_1 <> "  VS  " <> game.player_2
  end

  def create_game_link(game_id) when is_bitstring(game_id) do
    "game?=" <> game_id
  end
  def create_game_link(_), do: "/"

end

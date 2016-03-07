defmodule QuantumChess.PageView do
  use QuantumChess.Web, :view

  import Ecto.Query

  def get_active_games() do
    []

    #Repo.all(query)
  end

  def create_game_link(game_id) when is_bitstring(game_id) do
    "game?=" <> game_id
  end
  def create_game_link(_), do: "/"

end

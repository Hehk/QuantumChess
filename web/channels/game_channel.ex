defmodule QuantumChess.GameChannel do
  use QuantumChess.Web, :channel

  def join("games:" <> game_id, _params, socket) do
    {:ok, assign(socket, :game_id, game_id)}
  end

  def handle_in("piece_move", params, socket) do
    broadcast! socket, "piece_move", %{
      user: %{username: "anon"},
      start_point: params["start_point"],
      end_point: params["end_point"]
    }

    {:reply, :ok, socket}
  end

end

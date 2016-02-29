defmodule QuantumChess.GameChannel do
  use QuantumChess.Web, :channel
  alias QuantumChess.Games, as: Games

  def join("games:" <> game_id, %{"player_1" => p_1, "player_2" => p_2}, socket) do
    Games.start_link(game_id, p_1, p_2)

    {:ok, assign(socket, :game_id, game_id)}
  end

  def handle_in(event, params, socket) do
    user = Repo.get(QuantumChess.User, socket.assigns.user_id)
    handle_in(event, params, user, socket)
  end

  def handle_in("piece_move", params, user, socket) do
    game_id = socket.assigns.game_id
    active_player = Games.active_player(game_id)

    if active_player == user.username do
      Games.switch_active_player game_id
      broadcast! socket, "piece_move", %{
        user: %{username: "anon"},
        start_point: params["start_point"],
        end_point: params["end_point"]
      }

      {:reply, :ok, socket}
    else
      {:reply, {:error, %{reason: "not the active user"}}, socket}
    end
  end

end

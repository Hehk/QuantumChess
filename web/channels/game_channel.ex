defmodule QuantumChess.GameChannel do
  use QuantumChess.Web, :channel
  alias QuantumChess.Games, as: Games

  def join("games:" <> game_id, _params, socket) do
    Games.start_link(game_id)
    {:ok, assign(socket, :game_id, game_id)}
  end

  def handle_in(event, params, socket) do
    user = Repo.get(QuantumChess.User, socket.assigns.user_id)
    handle_in(event, params, user, socket)
  end

  def handle_in("add_player", _params, user, socket) do
    Games.add_player(socket.assigns.game_id, user.username)

    { :reply, :ok, socket }
  end

  def handle_in("piece_move", params, user, socket) do
    game_id = socket.assigns.game_id
    active_player = Games.active_player(game_id)

    IO.puts params["color"]
    if active_player.username == user.username && active_player.color == params["color"] do
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

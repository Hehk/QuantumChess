defmodule QuantumChess.UserChannel do
  use QuantumChess.Web, :channel

  def join("users:" <> user_group, _params, socket) do
    {:ok, assign(socket, :user_group, user_group)}
  end

  def handle_in("offer_game", target, socket) do
    broadcast! socket, "offer_game", %{
      user: %{username: "anon"},
      target: %{username: target}
    }

    {:reply, :ok, socket}
  end

  def handle_in("start_game", params, socket) do
    broadcast! socket, "start_game", %{
      user: %{username: "anon"},
      target: %{username: params["target"]},
      game_id: params["game_id"]
    }

    {:reply, :ok, socket}
  end

end

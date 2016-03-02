defmodule QuantumChess.UserChannel do
  use QuantumChess.Web, :channel

  def join("users:" <> user_group, _params, socket) do
    {:ok, assign(socket, :user_group, user_group)}
  end

  def handle_in(event, params, socket) do
    user = Repo.get(QuantumChess.User, socket.assigns.user_id)
    handle_in(event, params, user, socket)
  end

  def handle_in("offer_game", target, user, socket) do
    #token = Phoenix.Token.sign(conn, "user socket", user.id)

    broadcast! socket, "offer_game", %{
      from: %{username: user.username},
      to: %{username: target}
    }

    {:reply, :ok, socket}
  end

  def handle_in("start_game", params, user, socket) do
    [ other_user ] = Repo.all(from user in QuantumChess.User,
                              select: user,
                              where: user.username == ^params["to"])
    changeset = QuantumChess.ActiveGame.changeset(
      %QuantumChess.ActiveGame{},
      %{
        player_1: user.username,
        player_2: other_user.username,
        active_player: user.username,
        game_id: params["game_id"]
      });

    IO.inspect changeset
    case Repo.insert(changeset) do
      { :ok, changeset } ->
        IO.inspect changeset
        broadcast! socket, "start_game", %{
          from: %{username: user.username},
          to: %{username: params["to"]},
          game_id: params["game_id"]
        }

        {:reply, :ok, socket}
      { :error, changeset } ->
        {:reply, {:error, %{reason: "could not start game", errors: changeset}}. socket}
    end
  end

  def handle_in("get_user_info", _params, user, socket) do
    push socket, "user_info", %{
      username: user.username,
      id: user.id
    }

    {:reply, :ok, socket}
  end

end

defmodule QuantumChess.GameChannel do
  use QuantumChess.Web, :channel
  import Ecto.Query
  #import Ecto.Changeset

  def join("games:" <> game_id, _params, socket) do
    { :ok, assign(socket, :game_id, game_id) }
  end

  #########
  # Client-side Channel Commands

  def handle_in("get_game_info", _params, socket) do
    case get_game(socket.assigns.game_id) do
      %{ player_1: player_1, player_2: player_2, active_player: active_player } ->
        {:reply, {:ok, %{player_1: player_1, player_2: player_2, active_player: active_player}}, socket}

      :none ->
        {:reply, {:error, %{reason: "could not find this game"}}, socket}
    end
  end

  def handle_in("update_board", _params, socket) do
    query = from move in QuantumChess.GameMove,
            select: move,
            where: move.game_id == ^socket.assigns.game_id

    moves = Repo.all(query)
    |> Enum.sort(&(&1.order < &2.order))
    |> Enum.map(fn move ->
        %{ start_position: move.start_position,
           end_position:   move.end_position}
      end)

    { :reply, {:ok, %{moves: moves}}, socket }
  end

  def handle_in(event, params, socket) do
    user = Repo.get(QuantumChess.User, socket.assigns.user_id)
    handle_in(event, params, user, socket)
  end

  @doc """
    handles when a player hovers over a piece allowing the other to see what piece they
    are focusing on
  """
  def handle_in("piece_hover", position, user, socket) do
    username = user.username
    game     = get_game(socket.assigns.game_id)

    if (game.player_1 == username || game.player_2 == username) do
      broadcast! socket, "piece_hover", %{
        user: %{username: username},
        position: position
      }
    end

    { :reply, :ok, socket}
  end

  def handle_in("piece_move", params, user, socket) do
    username      = user.username
    game_id       = socket.assigns.game_id

    case get_game(game_id) do
      game_state = %{ active_player: active_player } when active_player == username ->
        if (valid_color(game_state, params["color"])) do
          [ count ] = Repo.all( from move in QuantumChess.GameMove,
                                select: count(move.game_id),
                                where: move.game_id == ^game_id)

          changeset = user
          |> build_assoc(:game_move, game_id: game_id, order: count)
          |> QuantumChess.GameMove.changeset(params)

          case Repo.insert(changeset) do
            { :ok, changeset } ->
              new_active_player = change_active_player(game_state)

              broadcast! socket, "piece_move", %{
                user: %{username: username},
                start_position: changeset.start_position,
                end_position: changeset.end_position,
                new_active_player: new_active_player
              }

              if (params["win"] == true) do
                end_game(game_state.id, game_id, active_player, new_active_player, socket)
              end

              { :reply, :ok, socket }

            { :error, changeset } ->
              { :reply, {:error, %{reason: "could not enter database", errors: changeset}}, socket}
          end
        else
          {:reply, {:error, %{reason: "not your piece"}}, socket}
        end

      %{} ->
        {:reply, {:error, %{reason: "not the active player"}}, socket}

      :none ->
        {:reply, {:error, %{reason: "could not find this game"}}, socket}
    end
  end

  ########
  # Private Functions

  defp get_game(game_id) do
    query = from game in QuantumChess.ActiveGame,
            select: game,
            where: game.game_id == ^game_id

    case Repo.all(query) do
      [ prev_player ] ->
        prev_player

      [] ->
        :none
    end
  end

  defp change_active_player(game_state) do
    case active_player_type(game_state) do
      :player_1 ->
        Repo.get(QuantumChess.ActiveGame, game_state.id)
        |> Ecto.Changeset.change(active_player: game_state.player_2)
        |> Repo.update

        game_state.player_2

      :player_2 ->
        Repo.get(QuantumChess.ActiveGame, game_state.id)
        |> Ecto.Changeset.change(active_player: game_state.player_1)
        |> Repo.update

        game_state.player_1
    end
  end

  defp active_player_type(game_state) do
    %{ player_1:      player_1,
       player_2:      player_2,
       active_player: active_player } = game_state

    cond do
      active_player == player_1 ->
        :player_1

      active_player == player_2 ->
        :player_2

      true ->
        :neither
    end
  end

  defp valid_color(game_state, color) do
    active_player = active_player_type(game_state)

    cond do
      active_player == :player_1 && color == "0" ->
        true

      active_player == :player_2 && color == "1" ->
        true

      true ->
        false
    end
  end

  defp end_game(id, game_id, winner, loser, socket) do
    Repo.get(QuantumChess.ActiveGame, id)
    |> Repo.delete!

    changeset = QuantumChess.FinishedGame.changeset(
      %QuantumChess.FinishedGame{},
      %{
        winner: winner,
        loser: loser,
        game_id: game_id
      })

    case Repo.insert(changeset) do
      { :ok, _changeset } ->
        broadcast! socket, "game_over", %{
          winner: winner,
          loser: loser
        }

        {:reply, :ok, socket}

      { :error, changeset } ->
        {:reply, {:error, %{reason: "Failed to end game!", errors: changeset}}, socket}
    end
  end

end

defmodule QuantumChess.Games do
  use GenServer

  #####
  # External API

  def start_link(game_id) do
    name = create_name game_id
    if GenServer.whereis(name) == nil do
      game_state = %{
        player_1: "",
        player_2: "",
        active_player: ""
      }

      GenServer.start_link(__MODULE__, game_state, name: name)
    else
      :not_empty
    end
  end

  def active_player(game_id) do
    game_id
    |> create_name
    |> GenServer.call(:active_player)
  end

  def switch_active_player(game_id) do
    game_id
    |> create_name
    |> GenServer.cast(:switch_active_player)
  end

  def add_player(game_id, player) do
    game_id
    |> create_name
    |> GenServer.cast({:add_player, player: player})
  end

  #####
  # GenServer implementation

  defp create_name(game_id) do
    "game_" <> game_id
    |> String.to_atom
  end

  def handle_call(:active_player, _from, game_state) do
    { :reply, game_state.active_player, game_state }
  end

  def handle_cast({:add_player, player: player}, game_state = %{player_1: player_1})
  when player_1 == "" do
    { :noreply, Map.put(game_state, :player_1, player) }
  end
  def handle_cast({:add_player, player: player}, game_state = %{player_1: player_1, player_2: player_2})
  when player_2 == "" do
    new_game_state = game_state
    |> Map.put(:player_2, player)
    |> Map.put(:active_player, player_1)

    { :noreply, new_game_state }
  end
  def handle_cast({:add_player, player: _player}, game_state) do
    { :noreply, game_state }
  end

  def handle_cast(:switch_active_player, game_state) do
    cond do
      game_state.player_1 == game_state.active_player ->
        { :noreply, Map.put(game_state, :active_player, game_state.player_2) }
      game_state.player_2 == game_state.active_player ->
        { :noreply, Map.put(game_state, :active_player, game_state.player_1) }
      true ->
        { :noreply, game_state }
    end
  end

  def format_status(_reason, [ _pdict, state ]) do
    [data: [{'State', "My current state is '#{inspect state}', and I'm happy"}]]
  end
end

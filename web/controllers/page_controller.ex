defmodule QuantumChess.PageController do
  use QuantumChess.Web, :controller

  def index(conn, _params) do
    #IO.inspect current_user

    if conn.assigns.current_user do
      render conn, "index.html", active_games: get_active_games(),
                                 active_users: get_active_users()
    else
      render conn, "index.html"
    end
  end

  defp get_active_games do
    query = from g in QuantumChess.ActiveGame,
              select: g

    Repo.all(query)
  end

  def get_active_users do
    query = from u in QuantumChess.User,
              select: u

    Repo.all(query)
  end

end

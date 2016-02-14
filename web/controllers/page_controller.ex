defmodule QuantumChess.PageController do
  use QuantumChess.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end

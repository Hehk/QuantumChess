defmodule QuantumChess.Repo.Migrations.DropActiveGames do
  use Ecto.Migration

  def change do
    drop table(:active_games)
  end
end

defmodule QuantumChess.Repo.Migrations.CreateFinishedGame do
  use Ecto.Migration

  def change do
    create table(:finished_games) do
      add :winner, :string
      add :loser, :string
      add :game_id, :string

      timestamps
    end

  end
end

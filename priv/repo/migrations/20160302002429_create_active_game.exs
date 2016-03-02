defmodule QuantumChess.Repo.Migrations.CreateActiveGame do
  use Ecto.Migration

  def change do
    create table(:active_games) do
      add :player_1, :string
      add :player_2, :string
      add :active_player, :string
      add :game_id, :string

      timestamps
    end
    create unique_index(:active_games, [:game_id])

  end
end

defmodule QuantumChess.Repo.Migrations.CreateActiveGame do
  use Ecto.Migration

  def change do
    create table(:active_games) do
      add :player_1, :string
      add :player_2, :string

      timestamps
    end

  end
end

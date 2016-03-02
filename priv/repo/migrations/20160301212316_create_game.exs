defmodule QuantumChess.Repo.Migrations.CreateGame do
  use Ecto.Migration

  def change do
    create table(:game) do
      add :player_1, references(:users, on_delete: :nothing)
      add :player_2, references(:users, on_delete: :nothing)
      add :winner, references(:users, on_delete: :nothing)

      timestamps
    end
    create index(:game, [:player_1])
    create index(:game, [:player_2])
    create index(:game, [:winner])

  end
end

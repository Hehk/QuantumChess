defmodule QuantumChess.Repo.Migrations.CreateGameMove do
  use Ecto.Migration

  def change do
    create table(:game_move) do
      add :game_id, :text
      add :start_position, :integer
      add :end_position, :integer
      add :order, :integer
      add :user_id, references(:users, on_delete: :nothing)

      timestamps
    end
    create index(:game_move, [:user_id])

  end
end

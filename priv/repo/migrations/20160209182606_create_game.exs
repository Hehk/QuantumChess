defmodule QuantumChess.Repo.Migrations.CreateGame do
  use Ecto.Migration

  def change do
    create table(:games) do
      add :player_1, :string
      add :player_2, :string
      add :winner, :string

      timestamps
    end

  end
end

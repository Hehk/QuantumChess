ExUnit.start

Mix.Task.run "ecto.create", ~w(-r QuantumChess.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r QuantumChess.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(QuantumChess.Repo)


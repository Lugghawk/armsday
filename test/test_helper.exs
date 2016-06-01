ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Armsday.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Armsday.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Armsday.Repo)


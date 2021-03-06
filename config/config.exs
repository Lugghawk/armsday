# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :armsday, Armsday.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "9PoSHQRk1MycJqZpHo0XfFcsHpOLDyroyiI8No5IvzLVZGg+P1zU4QCZCog7swto",
  render_errors: [accepts: ~w(html json)],
  bungie_api_key: "8352f2b5d28f4ac9957163ccdd050347",
  pubsub: [name: Armsday.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configure phoenix generators
config :phoenix, :generators,
  migration: true,
  binary_id: false

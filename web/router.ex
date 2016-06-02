defmodule Armsday.Router do
  use Armsday.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end


  scope "/", Armsday do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  scope "/Destiny", Armsday do
    pipe_through :browser

    get "/characters/:membershipType/:username", DestinyController, :account_lookup
    get "/armsday/:membershipId/:characterId", DestinyController, :armsday_orders
  end

  # Other scopes may use custom stacks.
  # scope "/api", Armsday do
  #   pipe_through :api
  # end
end

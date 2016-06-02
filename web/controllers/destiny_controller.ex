defmodule Armsday.DestinyController do
  use Armsday.Web, :controller
  alias Armsday.Destiny, as: Destiny

  def lookup(conn, %{"membershipType" => type, "username" => name}) do
    chars = Destiny.membership_id(name) |> Destiny.character_ids
    render conn, "chars.html", chars: chars
  end

  end

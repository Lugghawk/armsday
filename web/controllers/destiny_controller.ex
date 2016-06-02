defmodule Armsday.DestinyController do
  use Armsday.Web, :controller
  alias Armsday.Destiny, as: Destiny

  def account_lookup(conn, %{"membershipType" => type, "username" => name}) do
    membership_id = Destiny.membership_id(name) 
    chars = membership_id |> Destiny.character_ids
    render conn, "chars.html", chars: chars, membership_id: membership_id
  end

  def armsday_orders(conn, %{"membershipId" => membership_id, "characterId" => character_id}) do
    armsday_orders = Destiny.armsday_advisor membership_id, character_id
    render conn, "armsday.html", armsday_orders: armsday_orders
  end

end

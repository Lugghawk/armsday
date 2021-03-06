defmodule Armsday.DestinyController do
  use Armsday.Web, :controller
  alias Armsday.Destiny, as: Destiny

  def account_lookup(conn, %{"membershipType" => type, "username" => name}) do
    membership_id = Destiny.membership_id(name) 
    chars = Destiny.character_ids membership_id
    render conn, "chars.html", chars: chars, membership_id: membership_id
  end

  def armsday_orders(conn, %{"membershipId" => membership_id, "characterId" => character_id}) do
    armsday_orders = Destiny.armsday_advisor membership_id, character_id
    render conn, "armsday.html", armsday_orders: armsday_orders
  end

  def redemptions(conn, _params) do
    {:ok, file} = File.read "redemptions.json"
    redemptions = Poison.Parser.parse!(file)
    render conn, redemptions: redemptions
  end

end

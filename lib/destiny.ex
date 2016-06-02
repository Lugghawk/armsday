defmodule Armsday.Destiny do

  def api_key do
   Application.get_env(:armsday, Armsday.Endpoint)[:bungie_api_key]
  end

  def bungie_api_get(url) do
    HTTPotion.get(url, headers: ["X-API-Key": api_key])
  end

  def membership_id(username) do
    body = bungie_api_get("http://www.bungie.net/platform/Destiny/SearchDestinyPlayer/2/#{URI.encode(username)}/").body

    obj = Poison.Parser.parse!(body)
    IO.inspect(obj)
    obj["Response"] |> hd |> Map.get("membershipId")
  end

  def character_ids(membership_id) do
    body = bungie_api_get("http://www.bungie.net/platform/Destiny/2/Account/#{URI.encode(membership_id)}/Items/").body
    obj = Poison.Parser.parse!(body)
    obj["Response"]["data"]["characters"] |> Enum.map(fn x -> x["characterBase"]["characterId"] end)
  end

end


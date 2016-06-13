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
    obj["Response"] |> hd |> Map.get("membershipId")
  end

  def armsday_advisor(membership_id, character_id) do
    url = "https://www.bungie.net/Platform/Destiny/2/Account/#{URI.encode(membership_id)}/Character/#{URI.encode(character_id)}/Advisors/"
    obj = bungie_api_get(url).body |> Poison.Parser.parse!
    armsDay = obj["Response"] |> Map.get("data") |> Map.get("armsDay")
    redemptions = armsDay |> Map.get("redemptions")
    IO.inspect(redemptions)
  end

  def character_ids(membership_id) do
    body = bungie_api_get("http://www.bungie.net/platform/Destiny/2/Account/#{URI.encode(membership_id)}/Items/").body
    obj = Poison.Parser.parse!(body)
    obj["Response"]["data"]["characters"] |> Enum.map(fn x -> x["characterBase"]["characterId"] end)
  end

  def test_reformat_redemption do
    {:ok, redemptions_raw} = File.read("/home/justinf/src/armsday/data/redemptions-character-2305843009349174275.json")
    redemptions = Poison.Parser.parse!(redemptions_raw)

    reformat_redemptions(redemptions)
  end

  def reformat_redemptions(redemptions) do
    raw_weapons = redemptions["Response"]["data"]["armsDay"]["redemptions"] |> Map.values

    Enum.map(raw_weapons, &format_weapon/1)
  end

  def get_item(item_hash) do
    case item_hash do
      "3275294460" -> %{:name => "Suros ARI-41"}
      _ -> %{:name => "Item not found"}
    end
  end

  def get_talent_grid(talent_grid_hash) do
    case talent_grid_hash do
      "4058565332" ->
        {:ok, talentgrid_raw} = File.read("/home/justinf/src/armsday/data/ari-41-talentgrid.json")
        Poison.Parser.parse!(talentgrid_raw)["Response"]["data"]["talentGrid"]["nodes"]
      _ -> %{}
    end
  end

  def format_weapon(raw_weapon) do
    # We now have an array of hashes, each hash represents one roll

    # First get all of the rolls
    rolls = format_rolls(raw_weapon)

    # now do magic to get the item name and talent grid hash that we pluck off of the first node (they're all the same)
    item_hash = hd(rolls)[:item_hash] |> to_string
    talent_grid_hash = hd(rolls)[:talent_grid_hash] |> to_string

    item = get_item(item_hash)
    talent_grid_nodes = get_talent_grid(talent_grid_hash)

    hydrated_rolls = Enum.map(rolls, &(hydrated_nodes(&1, talent_grid_nodes)))

    %{
      :weapon_name => item[:name],
      :rolls => hydrated_rolls
    }
  end

  def hydrated_nodes(roll, talent_grid_nodes) do
    Enum.map(roll[:nodes], &(hydrate_node(&1, talent_grid_nodes)))
  end

  def hydrate_node(node, talent_grid_nodes) do
    data = Enum.find(talent_grid_nodes, fn(x) -> x["nodeHash"] == node[:node_hash] end)
    step = Enum.find(data["steps"], fn(x) -> x["stepIndex"] == node[:step_index] end)

    %{
      :row => data["row"],
      :column => data["column"],
      :name => step["nodeStepName"],
      :description => step["nodeStepDescription"]
    }
  end

  def format_rolls(raw_rolls) do
    Enum.map(raw_rolls, fn x ->
      %{
        :item_hash => x["item"]["itemHash"],
        :talent_grid_hash => x["item"]["talentGridHash"],
        :nodes => Enum.map(x["item"]["nodes"], &reformat_node/1)
      }
    end)
  end

  def reformat_node(raw_node) do
    %{
      :node_hash => raw_node["nodeHash"],
      :step_index => raw_node["stepIndex"]
    }
  end

end


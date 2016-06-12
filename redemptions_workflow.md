# Fetching redemptions data from the Bungie API

## 1. Find out who the user is

`privileged(https://www.bungie.net/Platform/User/GetBungieNetUser/)`

Usable information is stored in `psnId`, and probably `xboxId` once we get around to handling that

## 2. Get their membership id

`http(http://www.bungie.net/platform/Destiny/SearchDestinyPlayer/2/#{psn_id}/)`

The "2" in this query (and all future queries?) refers to PSN. We will need to change it for xbox. Returns an array of matching members, of which we can hopefully just take the first one, which would be an exact match? Either that, or we'll need to manually traverse the results to pick out the exact match. Then we take the membershipId out of that object.

## 3. Get their characters

Each membership can have up to 3 characters. We can get them from querying the items api (for some reason?)

`http(http://www.bungie.net/platform/Destiny/2/Account/#{membership_id}/Items/)`

`data.characters` is an array, from each we can get `characterBase.characterId` to end up with an array of character IDs that we'll need for the next step.

## 4. Get their redemptions

Each character has up to 3 redemptions per week. These are the actual armsday weapons that we care about. Unfortunately, redemptions are not revealed to the public API, so we have to use a privileged request to get them.

`privileged(https://www.bungie.net/Platform/Destiny/2/Account/#{membership_id}/Character/#{character_id}/Advisors/)`

We only care about the armsday redemption data from this response, which is a hash stored at `data.armsDay.redemptions`. This hash will have up to three id to array pairings. Each id corresponds to a different weapon, and the array stored inside will have three elements: one for each roll that's available. Each element inside the array is a hash. We need a few things that are under the `item` key:

1. the `itemHash`, which we can use for a lookup to get the name and image for the weapon (this will be the same for each element of the array, so we can use the first one).
2. The `talentGridhash`, which we can use to look up the talent grid for this weapon. Again, this will be the same for all three.
3. The nodes array. This is an array of hashes which tells us which talents are actually on the weapon, by means of two keys: the `nodeHash` and the `stepIndex`

## 5. Get the talent grid

`http(http://www.bungie.net/platform/Destiny/Manifest/TalentGrid/#{talent_grid_hash})`

We'll use this when iterating through all the nodes found in the last step. `data.talentGrid.nodes` contains a list of objects. Valuable information from this object: `nodeHash`, `steps`, `row`, and `column`. Nodehash corresponds to the nodeHash from the redemptions' nodes array. Row and column correspond to where they're displayed in the in-game grid, and thus will be valuable for when we're displaying them as well. Finally, we can look up the other half of the node information from the `steps` array, which contains a list of objects, each with a different `stepIndex`. By searching for the `stepIndex` from the redemption, we finally have an object containing the `nodeStepName` and `nodeStepDescription` that we want so badly.

defmodule Armsday.RoomChannel do
  use Phoenix.Channel

  def join("armsday:redemptions", _message, socket) do
    {:ok, socket}
  end

  def handle_in("redemptions_start", _, socket) do
    socket = handle_redemptions(socket)
    {:noreply, socket}
  end

  def handle_in("privileged_bungie_response", %{"url" => url, "response" => response}, socket) do
    case SocketRequestAgent.get_pid_for_request(url) do
      nil -> send socket.assigns[:replyto], {url, response}
      pid -> send pid, {url,response}
    end
    {:noreply, socket}
  end

  defp handle_redemptions(socket) do
    child_pid = spawn_link(fn ->
      username = psn_id(socket)
      membership_id = Armsday.Destiny.membership_id(username)
      characters = Armsday.Destiny.character_ids(membership_id)
      IO.puts("#{username} is membership_id #{membership_id} and their characters are")
      IO.inspect(characters)
      data = pmap(characters, fn x -> 
       redemptions(membership_id, x, socket)
      end) |> List.flatten
    push socket, "redemptions", %{redemptions: data}
    end)
  socket = assign(socket, :replyto, child_pid)
  socket
  end

  defp psn_id(socket) do
    privileged_bungie("https://www.bungie.net/Platform/User/GetBungieNetUser/", socket)["Response"]["psnId"]
  end

  defp redemptions(membership_id, character_id, socket) do
    url = "https://www.bungie.net/Platform/Destiny/2/Account/#{URI.encode(membership_id)}/Character/#{URI.encode(character_id)}/Advisors/"
    SocketRequestAgent.new_request(url, self)
    redemptions = privileged_bungie(url, socket) |> Armsday.Destiny.reformat_redemptions
  end

  defp privileged_bungie(url, socket) do
    push socket, "privileged_bungie", %{url: url}
    receive do
      {^url, response} -> response
    end
  end

  def pmap( collection, fun) do
    me = self
    collection
    |> Enum.map(fn(elem) ->
      spawn_link fn -> (send me, {self, fun.(elem)}) end
    end)
    |> Enum.map(fn (pid) ->
      receive do {^pid, result} -> result end
    end)
  end

end

defmodule Armsday.RoomChannel do
  use Phoenix.Channel

  def join("armsday:redemptions", _message, socket) do
    {:ok, socket}
  end

  def handle_in("redemptions_start", _, socket) do
    socket = psn_id(socket, fn psn_id ->
      IO.puts "psn_id: #{psn_id}"
      membership_id = Armsday.Destiny.membership_id(psn_id)
      IO.puts "membership_id: #{membership_id}"
      characters = Armsday.Destiny.character_ids(membership_id)
      IO.puts "characters"
      IO.inspect(characters)
    end)
    {:noreply, socket}
  end

  def handle_in("privileged_bungie_response", %{"url" => url, "response" => response}, socket) do
    IO.puts "Socket assigns:"
    IO.inspect socket.assigns

    send socket.assigns[url], {url, response}
    {:noreply, socket}
  end

  defp psn_id(socket, callback) do
    socket = privileged_bungie("https://www.bungie.net/Platform/User/GetBungieNetUser/", socket, fn response, socket ->
        callback.(response["Response"]["psnId"])
    end)
    socket
  end

  defp privileged_bungie(url, socket, callback) do
    pid = spawn_link fn ->
      push socket, "privileged_bungie", %{url: url}
      response = receive do
        {^url, response} -> response
      end
      callback.(response, socket)
    end
    socket = assign(socket, url, pid)
    socket
  end
end

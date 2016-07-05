defmodule SocketRequestAgentTest do
  use ExUnit.Case

  test "SocketRequestAgent accepts a url with its pid" do
    assert SocketRequestAgent.new_request("www.google.ca", self) == :ok
  end

  test "Should return pid of process associated with the url" do
    SocketRequestAgent.new_request("www.yahoo.com", self)
    assert SocketRequestAgent.get_pid_for_request("www.yahoo.com") == self
  end

  test "Getting a pid from SocketRequestAgent should clear that url/pid pair" do
    SocketRequestAgent.new_request("www.example.com", self)
    assert SocketRequestAgent.get_pid_for_request("www.example.com") == self
    assert SocketRequestAgent.get_pid_for_request("www.example.com") == nil
  end

  test "Should return pid of most recent request owner" do
    SocketRequestAgent.new_request("www.duckduckgo.com", self)
    parent = self
    child = spawn (fn ->
      SocketRequestAgent.new_request("www.duckduckgo.com", self)
      send parent, "done"
    end)
    receive do
      _ ->
        assert SocketRequestAgent.get_pid_for_request("www.duckduckgo.com") == child
    end
  end

end

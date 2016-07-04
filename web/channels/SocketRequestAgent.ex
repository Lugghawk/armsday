defmodule SocketRequestAgent do

  def start_link do
    Agent.start(fn -> Map.new end, name: __MODULE__)
  end

  def new_request(url, pid) do
    Agent.update(__MODULE__, &Map.put(&1, url, pid))
  end

  def get_pid_for_request(url) do
    Agent.get_and_update(__MODULE__, fn state ->
      pid = Map.get(state, url)
      Map.delete(state, url)
      {pid, state}
    end)
  end


end


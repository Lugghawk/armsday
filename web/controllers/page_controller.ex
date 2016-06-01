defmodule Armsday.PageController do
  use Armsday.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end

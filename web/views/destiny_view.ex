defmodule Armsday.DestinyView do
  use Armsday.Web, :view

  def render("redemptions.json", %{redemptions: redemptions}) do
    redemptions
  end

end

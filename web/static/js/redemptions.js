import socket from "./socket"
import PrivilegedBungie from "./privileged_bungie"

// socket.logger = (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }

var channel = socket.channel("armsday:redemptions", {})

channel.on("privileged_bungie", payload => {
  console.log("Recieved a request for a privileged_bungie API call to: " + payload["url"]);
  PrivilegedBungie.apiCall(payload["url"]).then(resp => {
    channel.push("privileged_bungie_response", {url: payload["url"], response: resp})
  });
});

channel.on("redemptions", payload => {
  console.log("Received redemptions", payload["redemptions"]);
  window.redemptions = payload["redemptions"];
  doHandleBars();
});

channel.join()
  .receive("error", resp => { console.log("Unable to join", resp) })
  .receive("ok", resp => {
    console.log("Joined successfully", resp);
    channel.push("redemptions_start");
})

let doHandleBars = () => {
  Handlebars.registerPartial("roll", $("#roll-partial").html());
  Handlebars.registerPartial("weapon", $("#weapon-partial").html());
  Handlebars.registerPartial("perkColumn", $("#perk-column-partial").html());
  Handlebars.registerPartial("perk", $("#perk-partial").html());

  Handlebars.registerHelper("inc", (number) => {
    return number+1;
  });

  Handlebars.registerHelper("perkColumns", (perks) => {
    let columns = _.groupBy(perks, (perk) => {
      return perk.column;
    })
    return _.toArray(columns);
  });

  let template = Handlebars.compile($("#redemptions-template").html());
  let area = $(".redemptions-area");
  area.append(template(redemptions));
}

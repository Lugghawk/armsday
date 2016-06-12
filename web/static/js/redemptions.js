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

channel.join()
  .receive("error", resp => { console.log("Unable to join", resp) })
  .receive("ok", resp => {
    console.log("Joined successfully", resp);
    channel.push("redemptions_start");
    //channel.push("privileged_bungie_response", {url: "hello", response: "world"})
})

if(typeof browser === 'undefined' && chrome) {
  window.browser = chrome;
}

import PrivilegedBungie from "./privileged_bungie"

var bungieUser = function() {
  return PrivilegedBungie.apiCall("https://www.bungie.net/Platform/User/GetBungieNetUser/");
}

bungieUser().then(function(user) {
  console.log("Hello, " + user['Response']['psnId']);
  window.bungieUser = user['Response'];
}).catch(function(message) {
  console.log("Error during privilegedBungieApiCall: " + message);
});

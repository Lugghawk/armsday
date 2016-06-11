if(typeof browser === 'undefined' && chrome) {
  window.browser = chrome;
}

var privilegedBungieApiCall = function(url) {
  return new Promise(function(fulfill, reject) {
    browser.runtime.sendMessage("lmbhbnnolkjmjgfaieegmlliglfdnadn", {url: url}, function(data) {
        if(data["status"] == "error") {
          reject(data["message"])
        } else {
          fulfill(data["data"])
        }
    });
  });
}

var bungieUser = function() {
  return privilegedBungieApiCall("https://www.bungie.net/Platform/User/GetBungieNetUser/");
}

bungieUser().then(function(user) {
  console.log("Hello, " + user['Response']['psnId']);
}).catch(function(message) {
  console.log("Error during privilegedBungieApiCall: " + message);
});

if(typeof browser === 'undefined' && chrome) {
  window.browser = chrome;
}

var bungieUser = function() {
  return new Promise(function(fulfill, reject) {
    browser.runtime.sendMessage("lmbhbnnolkjmjgfaieegmlliglfdnadn", {url: "https://www.bungie.net/Platform/User/GetBungieNetUser/"}, function(data){fulfill(data)});
  });
}

bungieUser().then(function(user) {
  console.log("Hello, " + user['Response']['psnId']);
});

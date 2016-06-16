let PrivilegedBungie = {
  EXTENSION_IDS: {
    "chrome": "lmbhbnnolkjmjgfaieegmlliglfdnadn",
    "firefox": "bungie_proxy@armsday.org"
  },

  sendMessage: function(message, callback) {
    var that = this;
    var browserType = null;
    var extensionPlatform = null;

    if(typeof window.chrome === 'object') {
      browserType = "chrome";
      extensionPlatform = window.chrome;
    } else {
      browserType = "firefox";
      extensionPlatform = window.browser;
    }

    console.log(that.EXTENSION_IDS);
    console.log(browserType);
    console.log(extensionPlatform);

    extensionPlatform.runtime.sendMessage(that.EXTENSION_IDS[browserType], message, callback);
  },

  apiCall: function(url) {
    var that = this;
    return new Promise(function(fulfill, reject) {
      that.sendMessage({type:"bungieapi", apiCall: {url: url}}, function(data) {
          if(data["status"] == "error") {
            reject(data["message"])
          } else {
            fulfill(data["data"])
          }
      });
    });
  },

  isInstalled: function() {
    var that = this;
    console.log("hello")
    return new Promise(function(fulfill, reject) {
      that.sendMessage({type: "installCheck"}, function(isInstalled){
        if (typeof isInstalled === 'undefined' || !isInstalled) {
          reject();
        } else {
          fulfill();
        }
      });
    });
  }
}

export default PrivilegedBungie;

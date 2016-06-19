let PrivilegedBungie = {
  apiCall: function(url) {
    return new Promise(function(fulfill, reject) {
      browser.runtime.sendMessage("lmbhbnnolkjmjgfaieegmlliglfdnadn", {type:"bungieapi", apiCall: {url: url}}, function(payload) {
          if(payload["status"] == "error") {
            reject(payload["message"])
          } else {
            let data = payload["data"]
            if(data["ErrorCode"] === 1) {
              fulfill(data)
            } else {
              reject(data["Message"])
            }
          }
      });
    });
  },
  isInstalled: function() {
	return new Promise(function(fulfill, reject) {
		browser.runtime.sendMessage("lmbhbnnolkjmjgfaieegmlliglfdnadn", {type: "installCheck"}, function(isInstalled){
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

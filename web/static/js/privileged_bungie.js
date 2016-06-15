let PrivilegedBungie = {
  apiCall: function(url) {
    return new Promise(function(fulfill, reject) {
      browser.runtime.sendMessage("lmbhbnnolkjmjgfaieegmlliglfdnadn", {type:"bungieapi", apiCall: {url: url}}, function(data) {
          if(data["status"] == "error") {
            reject(data["message"])
          } else {
            fulfill(data["data"])
          }
      });
    });
  },
  isInstalled: function() {
	return new Promise(function(fulfill, reject) {
		browser.runtime.sendMessage("lmbhbnnolkjmjgfaieegmlliglfdnadn", {type: "installCheck"}, function(isInstalled){
			if (typeof isInstalled === 'undefined' || !isInstalled) reject();
			fulfill();
		});
	});
  }
}

export default PrivilegedBungie;

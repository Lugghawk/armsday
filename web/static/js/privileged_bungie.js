let PrivilegedBungie = {
  apiCall: function(url) {
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
}

export default PrivilegedBungie;

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon';
import PrivilegedBungie from "../../web/static/js/privileged_bungie";

// I'm sure a lot of this can be cleaned up, somehow
chai.use(chaiAsPromised);
var expect = chai.expect;
global.browser = {};
global.browser.runtime = {};
global.browser.runtime.sendMessage = function(){};

describe("PrivilegedBungie", function() {
  describe("isInstalled", function() {
    var mock, chain;
    beforeEach(function() {
      mock = sinon.mock(global.browser.runtime);
      chain = mock.expects("sendMessage").withArgs("lmbhbnnolkjmjgfaieegmlliglfdnadn", {type: "installCheck"}).once()
    });

    afterEach(function() {
      mock.restore();
    });

    it("rejects when the extension could not be reached", function() {
      chain.callsArg(2);

      let promise = PrivilegedBungie.isInstalled();
      return expect(promise).to.be.rejectedWith(undefined);
    });

    it("fulfills when the extension responds", function() {
      chain.callsArgWith(2, true);

      let promise = PrivilegedBungie.isInstalled();
      return expect(promise).to.be.fulfilled;
    });
  });

  describe("apiCall", function() {
    var mock, chain;
    beforeEach(function() {
      mock = sinon.mock(global.browser.runtime);
      chain = mock.expects("sendMessage").withArgs("lmbhbnnolkjmjgfaieegmlliglfdnadn", {type: "bungieapi", apiCall: {url: "say_hello"}}).once()
    });

    afterEach(function() {
      mock.restore();
    });

    it("is fulfilled with data when the api call is successful", function() {
      chain.callsArgWith(2, {"status": "success", "data": {"ErrorCode": 1, "Response": "hello"}});

      let promise = PrivilegedBungie.apiCall("say_hello");
      return expect(promise).to.become({"ErrorCode": 1, "Response": "hello"});
    });

    it("is rejected with an error message when the api call fails", function() {
      chain.callsArgWith(2, {"status": "error", "message": "nope"});

      let promise = PrivilegedBungie.apiCall("say_hello");
      return expect(promise).to.be.rejectedWith("nope");
    });

    it("is rejected with an error message when bungie responds but the response is an error", function() {
      chain.callsArgWith(2, {"status": "success", "data": {"ErrorCode": 2101, "Message": "bungie nope"}});

      let promise = PrivilegedBungie.apiCall("say_hello");
      return expect(promise).to.be.rejectedWith("bungie nope");
    });
  });
});

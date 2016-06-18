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
    var mock = null;
    var chain = null;
    beforeEach(function() {
      mock = sinon.mock(global.browser.runtime);
      chain = mock.expects("sendMessage").withArgs("lmbhbnnolkjmjgfaieegmlliglfdnadn", {type: "installCheck"}).once()
    });

    afterEach(function() {
      mock.restore();
    });

    it("rejects the extension could not be reached", function() {
      chain.callsArgWith(2, undefined);

      let promise = PrivilegedBungie.isInstalled();
      return expect(promise).to.eventually.be.rejected;
    });

    it("fulfills when the extension responds", function() {
      chain.callsArgWith(2, true);

      let promise = PrivilegedBungie.isInstalled();
      return expect(promise).to.eventually.be.fulfilled;
    });
  });
});

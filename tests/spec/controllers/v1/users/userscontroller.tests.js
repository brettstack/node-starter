
describe('UsersController Tests', function() {

  var usersController;
  var req;
  var res;
  var next;

  beforeEach(function() {
    req = {};
    res = { status: function(code) { return { json: function(obj) {} }} };

    sinon.spy(res, "status");

    usersController = require('../../../../../app/controllers/v1/users/userscontroller');
  });

  describe('get()', function() {

    it('is a function', function() {
      expect(usersController.get).to.be.a('function');
    });

    it('should call res.status() one time', function() {
      usersController.get(req, res, next);

      expect(res.status.callCount).to.equal(1);
    });

    it('should call res.status() with 200', function() {
        usersController.get(req, res, next);

      expect(res.status.calledWith(200)).to.equal(true);
    });

  });
});

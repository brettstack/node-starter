
describe('UserService Tests', function() {

  var userService;

  beforeEach(function() {
    userService = require('../../../../app/services/users/userservice');
  });

  describe('getUser()', function() {

    it('is a function', function() {
      expect(userService.getUser).to.be.a('function');
    });

  });
});

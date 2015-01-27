
describe('UserRepository Tests', function() {

  var userRepository;

  beforeEach(function() {
    userRepository = require('../../../../app/repositories/users/userrepository');
  });

  describe('getUserData()', function() {

    it('is a function', function() {
      expect(userRepository.getUserData).to.be.a('function');
    });

  });
});

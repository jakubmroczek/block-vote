const UserRepository = require('../..//domain/UserRepository');
const mockUserRepository = new UserRepository();
const DeleteUser = require('../..//application/use_cases/DeleteUser');

test('should resolve (without result)', async () => {
  // given
  mockUserRepository.remove = jest.fn(() => true);

  // when
  await DeleteUser(123, { userRepository: mockUserRepository });

  // then
  expect(mockUserRepository.remove).toHaveBeenCalledWith(123);
});

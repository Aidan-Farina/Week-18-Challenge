const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getFriends,
  addFriend,
  removeFriend,
} = require('../../controllers/userController');

// Routes for users
router.route('/').get(getUsers).post(createUser);
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);
router.route('/:userId/friends').get(getFriends);
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;
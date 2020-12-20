const express = require("express");

const router = express.Router();
const {
  userById,
  getUser,
  allUsers,
  updateUser,
  updateUserProfile,
  userPhoto,
  deleteUser,
  getUserProfile,
  Register,
  Login,
  authUser,

  isAdmin,
} = require("../controllers/user");

router.post("/user/register", Register);

router.post("/user/login", Login);
router.get("/user/users", authUser, isAdmin(), allUsers);
router.get("/user/profile", authUser, getUserProfile);
router.put("/user/profile", authUser, updateUserProfile);
router.get("/user/:userId", getUser);
router.get("/user/photo/:userId", userPhoto);

router.put("/user/:userId", authUser, isAdmin(), updateUser);

router.delete("/user/:userId", authUser, isAdmin(), deleteUser);

//any route contating userId will execute first userById
router.param("userId", userById);

module.exports = router;

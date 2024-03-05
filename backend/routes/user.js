const express = require("express");
const zod = require("zod");
const router = express.Router();
const { signUpUser, signInUser } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/middleware");

router.route("/signup").post(signUpUser);
router.route("/signin").post(signInUser);

// update user
const updateBody = zod.object({
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});
router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error in updating information",
    });
  }
  await User.updateOne(req.body, {
    id: req.userId,
  });

  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regrex: filter,
        },
      },
      {
        lastName: {
          $regrex: filter,
        },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;

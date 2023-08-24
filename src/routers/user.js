const express = require("express");
const userRouter = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

// Read all users
userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(400).send(e);
  }

  // User.find({})
  //   .then((users) => {
  //     res.send(users);
  //   })
  //   .catch((e) => {
  //     res.status(400).send(e);
  //   });
});

// read Me
userRouter.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(401).send(e);
  }
});

// Read User
userRouter.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    if (e.name == "CastError") {
      return res.status(404).send();
    }
    res.status(500).send(e);
  }

  // User.findById(req.params.id)
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(404).send();
  //     }
  //     res.send(user);
  //   })
  //   .catch((e) => {
  //     if (e.name == "CastError") {
  //       return res.status(404).send();
  //     }
  //     res.status(500).send(e);
  //   });
});

// create user
userRouter.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    await res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }

  // const user = new User(req.body);
  // user
  //   .save()
  //   .then(() => {
  //     res.status(201).send(user);
  //   })
  //   .catch((e) => {
  //     res.status(400).send(e);
  //   });
});

// Delete User
userRouter.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    console.log(user.id);
    const result = await User.deleteOne({ _id: user.id });
    res.send(
      `${result.deletedCount} users ${
        result.deletedCount > 1 ? "are" : "is"
      } deleted, ${user}`
    );
    console.log(result);
  } catch (e) {
    if (e.name == "CastError") {
      return res.status(404).send();
    }
    res.status(500).send(e);
  }
});

module.exports = userRouter;

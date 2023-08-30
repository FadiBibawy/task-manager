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
});

// Login
userRouter.get("/users/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    const check = await User.checkUser(email, password);
    if (!check) {
      throw new Error();
    }
    // console.log(user.tokens[0].token);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate" });
  }
});

// Logout
userRouter.get("/users/logout", auth, async (req, res) => {
  try {
    const id = req.user._id.toString();
    const user = await User.findById(id);
    user.tokens = user.tokens.filter((token) => token.token !== req.token);
    await user.save();
    res.send(user);

    // res.send({ user, token });
  } catch (e) {
    res.status(500).send({ error: "Please Authenticate" });
  }
});

// Logout All
userRouter.get("/users/logoutall", auth, async (req, res) => {
  try {
    // const id = req.user._id.toString();
    // const user = await User.findById(id);
    // user.tokens = [];
    // await user.save();

    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send({ error: "Please Authenticate" });
  }
});

// read Me
userRouter.get("/users/me", auth, async (req, res) => {
  try {
    // console.log(req.user);
    await req.user.populate("tasks");
    const tasks = req.user.tasks;
    // console.log(req.user);
    res.send({ user: req.user, token: req.token, tasks });
  } catch (e) {
    res.status(401).send(e);
  }
});

// Update Me
userRouter.patch("/users/me", auth, async (req, res) => {
  try {
    const permitedParams = ["name", "email", "password", "age"];
    const params = Object.keys(req.body);
    const isPermited = params.every((param) => permitedParams.includes(param));
    if (!isPermited) {
      return res.status(400).send("you are not allowed to update that field");
    }
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body);
    // const user = await User.findById(req.user.id);
    const user = req.user;
    await User.updateOne(user, req.body);
    console.log(user);
    // params.forEach((param) => {
    //   task[param] = req.user[param];
    // });
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send();
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
});

// Delete User
// userRouter.delete("/users/:id", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     console.log(user.id);
//     const result = await User.deleteOne({ _id: user.id });
//     res.send(
//       `${result.deletedCount} users ${
//         result.deletedCount > 1 ? "are" : "is"
//       } deleted, ${user}`
//     );
//     console.log(result);
//   } catch (e) {
//     if (e.name == "CastError") {
//       return res.status(404).send();
//     }
//     res.status(500).send(e);
//   }
// });

// Delete me
userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.user.id);

    // const result = await User.deleteOne({ _id: user.id });
    // res.send(
    //   `${result.deletedCount} users ${
    //     result.deletedCount > 1 ? "are" : "is"
    //   } deleted, ${user}`
    // );
    // console.log(result);
    res.send(`User ${req.user.email} is deleted`);
  } catch (e) {
    // if (e.name == "CastError") {
    //   return res.status(404).send();
    // }
    res.status(500).send(e);
  }
});

module.exports = userRouter;

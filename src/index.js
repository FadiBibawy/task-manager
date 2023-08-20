const express = require("express");
const app = express();
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Tasks App");
});

// Read all tasks
app.get("/tasks", async (req, res) => {
  // await res.send(tasks);

  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }

  // Task.find()
  //   .then((tasks) => {
  //     res.send(tasks);
  //   })
  //   .catch((e) => {
  //     res.status(500).send(e);
  //   });
});

// Read Task
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send(e);
    }
    res.send(task);
  } catch (e) {
    if (e.name == "CastError") {
      return res.status(404).send(e);
    }
    res.status(500).send(e);
  }

  // Task.findById(req.params.id)
  //   .then((task) => {
  //     if (!task) {
  //       return res.status(404).send();
  //     }
  //     res.send(task);
  //   })
  //   .catch((e) => {
  //     if (e.name == "CastError") {
  //       return res.status(404).send(e);
  //     }
  //     res.status(500).send(e);
  //   });
});

// create task
app.post("/tasks", async (req, res) => {
  // await res.send(tasks);

  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }

  // const task = new Task(req.body);
  // task
  //   .save()
  //   .then((task) => {
  //     res.status(201).send(task);
  //   })
  //   .catch((e) => {
  //     res.status(400).send(e);
  //   });
});

// Read all users
app.get("/users", async (req, res) => {
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

// Read User
app.get("/users/:id", async (req, res) => {
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
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
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

app.delete("/users/:id", async (req, res) => {
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

  // User.findById(req.params.id)
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(404).send();
  //     }
  //     console.log(user.id);
  //     User.deleteOne({ _id: user.id })
  //       .then((result) => {
  //         res.send(
  //           `${result.deletedCount} users ${
  //             result.deletedCount > 1 ? "are" : "is"
  //           } deleted, ${user}`
  //         );
  //         console.log(result);
  //       })
  //       .catch((e) => {
  //         res.status(409).send(e);
  //       });
  //   })
  //   .catch((e) => {
  //     if (e.name == "CastError") {
  //       return res.status(404).send();
  //     }
  //     res.status(500).send(e);
  //   });
});

app.listen(3000);

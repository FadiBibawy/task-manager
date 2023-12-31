const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const taskRouter = new express.Router();

// Read all tasks
taskRouter.get("/tasks", async (req, res) => {
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
taskRouter.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("owner");

    if (req.user.id !== task.owner.id) {
      throw new Error("You are not Authenticated to open this task");
    }
    // await task.populate("owner");
    if (!task) {
      return res.status(404).send(e);
    }
    res.send(task);
  } catch (e) {
    if (e.name == "CastError") {
      return res.status(404).send(e);
    }
    res.status(500).send(e.message);
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

// Read my tasks
taskRouter.get("/myTasks", auth, async (req, res) => {
  try {
    console.log(req.user);
    await req.user.populate("tasks");
    const tasks = req.user.tasks;
    // await task.populate("owner");

    res.send(tasks);
  } catch (e) {
    if (e.name == "CastError") {
      return res.status(404).send(e);
    }
    res.status(500).send(e);
  }
});

// create task
taskRouter.post("/tasks", auth, async (req, res) => {
  // await res.send(tasks);

  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    // task.owner = req.user._id;
    // req.user.tasks.push(task._id);
    await req.user.save();
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

// Update Task
taskRouter.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const permitedParams = ["completed"];
    const params = Object.keys(req.body);
    const isPermited = params.every((param) => permitedParams.includes(param));

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    console.log(!task);

    // if the user is not authenticated
    if (!task) {
      return res.status(404).send();
    }
    console.log(!task);

    if (!isPermited) {
      return res.status(400).send("you are not allowed to update that field");
    }
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body);
    params.forEach((param) => {
      task[param] = req.body[param];
    });
    await task.save();

    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Delete Task
taskRouter.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = taskRouter;

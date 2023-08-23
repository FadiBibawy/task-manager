const express = require("express");
const Task = require("../models/task");

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
taskRouter.get("/tasks/:id", async (req, res) => {
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
taskRouter.post("/tasks", async (req, res) => {
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

module.exports = taskRouter;

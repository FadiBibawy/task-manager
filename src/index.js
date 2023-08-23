const express = require("express");
const app = express();
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.get("/", function (req, res) {
  res.send("Tasks App");
});

app.listen(3000);

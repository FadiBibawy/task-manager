//  CRUD operations

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const chalk = require("chalk");
const connectionURL = "mongodb://127.0.0.1:27017";

console.log("mongo is going to connect");
MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      console.log(chalk.red("coudn't connect to db"));
    }
    console.log(chalk.green("connected"));
    const db = client.db("task-manager");
    const users = db.collection("user");
    const tasks = db.collection("tasks");

    // READ:
    // -------------------------------------------------
    // db.collection("user")
    //   .find({ name: "Sherry" })
    //   .toArray((error, users) => {
    //     console.log(users);
    //   });

    // const lastTask = db
    //   .collection("tasks")
    //   .find()
    //   .limit(1)
    //   .sort({ $natural: -1 })
    //   .toArray((error, task) => {
    //     // console.log(task);
    //   });

    // const nonCompletedTasks = db
    //   .collection("tasks")
    //   .find({ completed: false })
    //   .toArray((e, tasks) => {
    //     if (e) {
    //       console.log(e);
    //     } else {
    //       console.log(tasks);
    //     }
    //   });

    // console.log(lastTask);
    // console.log(sherry);

    // sherry.forEach((element) => {
    //   console.log(element.name);
    // });
    // lastTask.forEach((task) => {
    //   console.log(task);
    // });

    // CREATE:
    // -------------------------------------------------

    // db.collection("user").insertMany(
    //   [
    //     { name: "Sherry", age: 28 },
    //     { name: "Shalaby", age: 40 },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       console.log(chalk.red("couldn't add document"));
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("tasks").insertMany(
    //   [
    //     { description: "this is my first task", completed: false },
    //     { description: "this is my second task", completed: true },
    //     { description: "this is my 3 task", completed: false },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       console.log("couldn't add tasks");
    //     } else {
    //       console.log(result.ops);
    //     }
    //   }
    // );

    // UPDATE:
    // -------------------------------------------------

    tasks
      .updateMany({ name: "fadi" }, { $set: { name: false } })
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.log(e);
      });
  }
);

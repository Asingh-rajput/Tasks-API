const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const port = 8080;

//set a view engine
app.set("view engine", "ejs");
//use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
mongoose
  .connect("mongodb+srv://root:Ashutosh@cluster0.5tscpdi.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch(() => {
    console.log("Error connecting to mongodb");
  });
const taskSchema = new mongoose.Schema({
  id: Number,
  title: String,
});
const Task = mongoose.model("Task", taskSchema);

//routes
app.get("/", function (req, res) {
  res.send("Hello WOrld!");
});

let task = [];
app.post("/v1/tasks", async (req, res) => {
  try {
    let task = new Task({
      id: req.body.id,
      title: req.body.title,
      is_completed: req.body.is_completed === "true" ? true : false,

      //     description:req.body.description,
      //     created_at:new Date(),
      //    updated_at:new Date()
    });
    task.save();
    res.json({
      status: 201,
      message: "Task created successfully",
      data: {
        id: task.id,
        title: task.title,
        is_completed: task.is_completed,
      },
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Error in creating task",
    });
  }
});
//get a all task
app.get("/v1/tasks", async (req, res) => {
  try {
    let tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.json({
      status: 500,
      message: "Error in getting tasks",
    });
  }
});
//
//get a specific task
app.get("/v1/tasks/:id", async (req, res) => {
  const { id } = req.query;
  try {
    let task = await Task.findOne(id);
    res.json({
      status: 200,
      message: "Task found successfully",
      data: {
        id: task.id,
        title: task.title,
        is_completed: task.is_completed,
      },
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Error in getting task",
      data: {
        id: err.message,
      },
    });
  }
});
app.delete("/v1/tasks/:id", async (req, res) => {
  const { id } = req.query;
  try {
    let task = await Task.findById(id, req.body);
    //await task.remove();
    res.json({
      status: 200,
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.json({
      status: 204,
      message: "none",
      data: {
        id: err.message,
      },
    });
  }
});
app.delete("/v1/tasks", async (req, res) => {
  const { id } = req.query;
  try {
    let task = await Task.findByIdAndDelete(id, req.body);
    //await task.remove();
    res.json({
      status: 200,
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.json({
      status: 204,
      message: "none",
      data: {
        id: err.message,
      },
    });
  }
});

app.put("/v1/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let task = await Task.findById(id, req.body);
    task.title = req.body.title;
    task.is_completed = req.body.is_completed;
    //await task.save();
    res.json({
      status: 204,
      message: "None",
      data: {
        id: task.id,
        title: task.title,
        is_completed: task.is_completed,
      },
    });
  } catch (err) {
    res.json({
      status: 404,
      message: "id not found",
      data: {
        id: err.message,
      },
    });
  }

  // const task=await Task.findByIdAndUpdate(id,req.body,{new:true})
  // res.json({
  //     status: 200,
  //     message: "Task updated successfully",
  //     data: {
  //         id: task.id,
  //         title: task.title,
  //         is_completed: task.is_completed
  //         }
  //         });
});

app.listen(port, () => console.log(`server is running on port ${port}`));

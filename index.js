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
  title: String,
  //completed:true
});
const Task = mongoose.model("Task", taskSchema);

//routes
app.get("/", function (req, res) {
  res.send("Hello WOrld!");
});

// Create Tasks
let tasks = [];

// Create a new task
app.post('/v1/tasks', (req, res) => {
  const task = {
    id: tasks.length + 1,
    title: req.body.title,
    is_completed: false,
  };
  tasks.push(task);
  res.status(201).json({ id: task.id });
});

// List all tasks created
app.get('/v1/tasks', (req, res) => {
  res.status(200).json({ tasks });
});

// Get a specific task
app.get('/v1/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    res.status(404).json({ error: 'There is no task at that id' });
  } else {
    res.status(200).json(task);
  }
});

// Delete a specific task
app.delete('/v1/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'There is no task at that id' });
  } else {
    tasks.splice(index, 1);
    res.status(204).send();
  }
});

// Edit the title or completion of a specific task
app.put('/v1/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    res.status(404).json({ error: 'There is no task at that id' });
  } else {
    if (req.body.title) {
      task.title = req.body.title;
    }
    if (req.body.is_completed !== undefined) {
      task.is_completed = req.body.is_completed;
    }
    res.status(204).send();
  }
});

// Bulk add tasks
app.post('/v1/tasks', (req, res) => {
  const newTasks = req.body.tasks.map((task) => ({
    id: tasks.length + 1,
    title: task.title,
    is_completed: task.is_completed || false,
  }));
  tasks = tasks.concat(newTasks);
  res.status(201).json({ tasks: newTasks.map((t) => ({ id: t.id })) });
});

// Bulk delete tasks
app.delete('/v1/tasks', (req, res) => {
  const ids = req.body.tasks.map((task) => task.id);
  tasks = tasks.filter((t) => !ids.includes(t.id));
  res.status(204).send();
});
app.listen(port, () => console.log(`server is running on port ${port}`));

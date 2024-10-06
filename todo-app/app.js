/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  try {
    const allTodos = await Todo.getTodos();
    if (request.accepts("html")) {
      response.render("index", { allTodos });
    } else response.json(allTodos);
  } catch (error) {
    console.error(error);
    response.status(404).json({ error: "Failed to fetch todos" });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Failed to fetch todos" });
  }
});

app.post("/todos", async (request, response) => {
  console.log("POST Todo", request.body);
  //todo
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("We have updated a todo with ID: ", request.params.id);

  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: "Todo not found" });
    }

    // Update the completed status
    todo.completed = true;
    await todo.save(); // Save the changes

    return response.json(todo); // Return the updated todo
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to update todo" });
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);

  try {
    const result = await Todo.destroy({
      where: { id: request.params.id },
    });

    // If result is 1, the deletion was successful
    if (result === 1) {
      return response.status(200).json(true);
    } else {
      // If no rows were affected, the todo didn't exist
      return response.status(404).json(false);
    }
  } catch (error) {
    console.error("Error deleting Todo:", error);
    return response.status(500).json(false);
  }
});

module.exports = app;

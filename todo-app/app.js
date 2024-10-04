/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.send("Hello World");
});

app.get("/todos", (request, response) => {
  console.log("GET Todo List");
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

app.delete("/todos/:id", (request, response) => {
  console.log("We have deleted a todo with ID: ", request.params.id);
});

module.exports = app;

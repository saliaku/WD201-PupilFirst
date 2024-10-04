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

app.delete("/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  try {
    const deletedCount = await Todo.destroy({ where: { id: todoId } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ success: true }); // Returns a boolean response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = app;

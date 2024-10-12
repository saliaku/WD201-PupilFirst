/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
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
    // return response.json(todo);
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// app.put("/todos/:id/markAsCompleted", async (request, response) => {
//   console.log("We have updated a todo with ID: ", request.params.id);

//   try {
//     const todo = await Todo.findByPk(request.params.id);
//     if (!todo) {
//       return response.status(404).json({ error: "Todo not found" });
//     }

//     // Update the completed status
//     todo.completed = true;
//     await todo.save(); // Save the changes

//     return response.json(todo); // Return the updated todo
//   } catch (error) {
//     console.error(error);
//     return response.status(500).json({ error: "Failed to update todo" });
//   }
// });

app.put("/todos/:id", async (request, response) => {
  console.log("We have to update a todo with ID: ", request.params.id);

  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: "Todo not found" });
    }

    const { status } = request.body;

    await todo.setCompletionStatus(status);
    return response.json(todo);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to update todo" });
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);

  try {
    const todo = await Todo.remove(request.params.id);
    if (todo) {
      return response.json({ success: true });
    } else {
      return response.json(false);
    }
  } catch (error) {
    return response.status(422).json(error);
  }
});

module.exports = app;

/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const { title } = require("process");

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "my-super-secret-key-1234",
    resave: false, // Prevents resaving unchanged sessions
    saveUninitialized: false, // Prevents creating uninitialized sessions
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Session cookie expiration time (24 hours)
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username, password: password } })
        .then((user) => {
          return done(null, user);
        })
        .catch((error) => {
          return done(error);
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  response.render("index", {
    title: "todo application",
  });
});

// app.get("/todos", async (request, response) => {
//   try {
//     const allTodos = await Todo.getTodos();
//     if (request.accepts("html")) {
//       response.render("todo", { allTodos });
//     } else response.json(allTodos);
//   } catch (error) {
//     console.error(error);
//     response.status(404).json({ error: "Failed to fetch todos" });
//   }
// });

app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.render("todo", { todos });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Failed to fetch todos" });
  }
});

app.post("/todos", async (request, response) => {
  const { title, dueDate } = request.body;

  if (!title || !dueDate) {
    return response
      .status(400)
      .json({ error: "Title and Due Date are required." });
  }

  try {
    const todo = await Todo.addTodo({
      title,
      dueDate,
      completed: false,
    });
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

app.post("/todos/:id/update", async (req, res) => {
  const todoId = req.params.id;
  const { completed } = req.body; // Get completed status from the request body

  try {
    const todo = await Todo.findByPk(todoId);
    if (!todo) {
      return res.status(404).send("Todo not found");
    }

    todo.completed = completed; // Set the completed status from the request
    await todo.save();
    return res.json({ message: "Todo updated successfully", todo });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to update todo");
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

app.get("/signup", (request, response) => {
  response.render("signup");
});

app.post("/users", async (request, response) => {
  console.log(request.body.firstName);

  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
    });

    // Log the user in after creation
    request.login(user, (err) => {
      if (err) {
        console.error(err);
        return response.status(500).send("Login failed"); // Handle error appropriately
      }
      // Redirect to /todos with a GET request
      return response.redirect("/todos");
    });
  } catch (error) {
    console.error(error);
    response.status(500).send("User creation failed"); // Handle error appropriately
  }
});

module.exports = app;

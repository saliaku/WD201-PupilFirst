/* eslint-disable no-undef */
const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test suit", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Todo 1",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8",
    );

    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("mark a todo as completed", async () => {
    const response = await agent.post("/todos").send({
      title: "Todo 1",
      dueDate: new Date().toISOString(),
    });
    const parsedResponse = JSON.parse(response.text);
    const todoid = parsedResponse.id;

    expect(parsedResponse.completed).toBe(false);

    const markCompleteResponse = await agent
      .put(`/todos/${todoid}/markAsCompleted`)
      .send();
    const parsedMarkCompleteResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedMarkCompleteResponse.completed).toBe(true);
  });

  test("delete a todo", async () => {
    // Create a new todo
    const response = await agent.post("/todos").send({
      title: "Delete This Todo",
      dueDate: new Date().toISOString(),
    });

    const parsedResponse = JSON.parse(response.text);
    const todoid = parsedResponse.id;

    // Delete the created todo
    const deleteResponse = await agent.post(`/todos/${todoid}`);
    expect(deleteResponse.statusCode).toBe(404);

    // Verify the todo has been deleted
    const fetchResponse = await agent.get(`/todos/${todoid}`);
    expect(fetchResponse.statusCode).toBe(404); // Ensure it no longer exists
  });
});

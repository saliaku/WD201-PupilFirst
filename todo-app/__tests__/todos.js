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
  const response = await agent.post("/todos").send({
    title: "Todo 1",
    dueDate: new Date().toISOString(),
  });
  const parsedResponse = JSON.parse(response.text);
  const todoid = parsedResponse.id;

  const deleteResponse = await agent.delete(`/todos/${todoid}`).send();
  expect(deleteResponse.statusCode).toBe(200); // Expecting 200 for a successful deletion response
  expect(deleteResponse.body.success).toBe(true); // Expecting a boolean response
});

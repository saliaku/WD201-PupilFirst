/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add } = todoList();

describe("Todo List Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
  });

  //test that checks creating a new todo
  test("Shouw add new todo", () => {
    const todoItemCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all.length).toBe(todoItemCount + 1);
  });

  //marking a todo as complete
  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  // //retrieval of overdue items
  // test("Retrieval of overdue items", () =>{

  // });

  // //retrievval of due today items
  // test("Retrieval of due today items", () =>{

  // });

  // //retrieval of due later items
  // test("Retrieval of due later items", () =>{

  // });
});

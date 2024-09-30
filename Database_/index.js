/* eslint-disable no-unused-vars */
const {connect} = require("./connectDB.js");
const Todo = require("./TodoModel.js");

const createTodo = async () => {
    try {
        await connect();
        const todo = await Todo.addTask({
            title: "third Item",
            completed: false,
            dueDate: new Date(),
        });
        console.log(`created todo with ID: ${todo.id}`);
    } catch (error) {
        console.error("Unable to create todo:", error);
    }
};

const countItems = async () => {
    try {
        const totalCount = await Todo.count();
        console.log(`Found ${totalCount} items in the table !`);
    } catch (error) {
        console.error("Unable to count items:", error);
    }
};

const getAllTodos = async () => {
    // try {
    //     const todos = await Todo.findAll({
    //         where: {
    //             completed: false
    //         },
    //         order: [
    //             ['id','DESC']
    //         ]
    //     });
    try {
        const todos = await Todo.findAll();
        
        const todoList = todos.map((todo) => todo.displayableString()).join("\n");
        console.log(todoList);
    } catch (error) {
        console.error("Unable to get todos:", error);
    }
}

const getSingleTodo = async () => {
    try {
        const todo = await Todo.findOne({
            where: {
                completed: false
            },
            order: [
                ['id','DESC']
            ]
        });
        
        const todoList = todo.displayableString();
        console.log(todoList);
    } catch (error) {
        console.error("Unable to get single todo:", error);
    }
}

const updateItem = async (id) => {
    try {
        await Todo.update({completed: true}, {
            where: {
                id: id
            }
        });
        
    } catch (error) {
        console.error("Unable to update todo:", error);
    }
};

const deleteItem = async (id) => {
    try {
        const deletedRowCount = await Todo.destroy({
            where: {
                id: id
            }
        });

        console.log(`Deleted ${deletedRowCount} row(s)`);
        
    } catch (error) {
        console.error("Unable to delete todo:", error);
    }
}

// //Immediately Invoked Function Expression (IIFE)
// (async() =>{
//     // await createTodo();
//     // await countItems();
//     await getAllTodos();
//     // await getSingleTodo();
//     // await updateItem(2);
//     await deleteItem(2);
//     await getAllTodos();
// })();

//whichever finishes first returns first in this way of calling functions
getAllTodos();
countItems();

// instead of defining these inside a run function, and then making it async
// we can directly call the functions as they are async and will return a promise
// putting () immeditely after the function will call the function
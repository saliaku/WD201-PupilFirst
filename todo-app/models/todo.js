/* eslint-disable no-unused-vars */
"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");
const today = new Date().toISOString().split("T")[0];
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static getTodos() {
      return this.findAll();
    }

    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdue = await Todo.overdue();
      overdue.forEach((todo) => {
        console.log(todo.displayableString());
      });

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const dueToday = await Todo.dueToday();
      dueToday.forEach((todo) => {
        console.log(todo.displayableString());
      });

      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dueLater = await Todo.dueLater();
      dueLater.forEach((todo) => {
        console.log(todo.displayableString());
      });
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
        },
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: today,
          },
        },
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today,
          },
        },
      });
    }

    static async remove(id) {
      return await Todo.destroy({
        where: {
          id: id,
        },
      });
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      if (this.dueDate === today) {
        return `${this.id}. ${checkbox} ${this.title}`;
      }
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }

    static addTodo({ title, dueDate }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
      });
    }
    // markAsCompleted() {
    //   return this.update({
    //     completed: true,
    //   });
    // }

    setCompletionStatus(status) {
      this.completed = !status;
      return this.save();
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};

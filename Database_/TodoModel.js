// eslint-disable-next-line no-unused-vars
const {Sequelize, DataTypes, Model} = require("sequelize");
const {sequelize} = require("./connectDB");

class Todo extends Model {
    static async addTask(params){
        return await Todo.create(params);
    }

    displayableString(){
        return `${this.completed ? '[x]': '[ ]'} ${this.id}. ${this.title} - ${this.dueDate}`;
    }
}

Todo.init(
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

module.exports = Todo;

Todo.sync();
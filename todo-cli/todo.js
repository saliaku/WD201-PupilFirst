const todoList = () => {
  all = []
  const add = (todoItem) => {
    all.push(todoItem)
  }
  const markAsComplete = (index) => {
    all[index].completed = true
  }

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    let res= [];
    all.filter((item) => {
      if (item.dueDate < today) {
        res.push(item);
      }
    });
    return res;
  }

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    let res= [];
    all.filter((item) => {
        if (item.dueDate === today) {
            res.push(item);
        }
        });

    return res;
  }

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    let res= [];
    all.filter((item) => {
        if (item.dueDate > today) {
            res.push(item);
        }
        });
    return res;
  }

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    res = [];
    list.forEach(element => {
        if (element.completed && element.dueDate != today) {
            res.push("[x] " + element.title + " " + element.dueDate);
        } else if (!element.completed && element.dueDate != today){
            res.push("[ ] " + element.title + " " + element.dueDate);
        }

        if (element.completed && element.dueDate === today) {
            res.push("[x] " + element.title);
        } else if (!element.completed && element.dueDate === today){
            res.push("[ ] " + element.title);
        }

    });

    return res.join("\n");

  }

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList
  };
};

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

module.exports = todoList;
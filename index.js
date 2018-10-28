function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}

const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

// ACTION CREATORS
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

// ToDo REDUCER
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map(
        todo =>
          todo.id !== action.id
            ? todo
            : Object.assign({}, todo, { completed: !todo.completed }),
      );
    default:
      return state;
  }
}

// Goal REDUCER
function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id);
    default:
      return state;
  }
}

//MIDDLEWARE
const checker = store => next => action => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes('bitcoin')
  ) {
    return alert('Nope. Bitcoin is a bad idea!');
  }

  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes('bitcoin')
  ) {
    return alert('Nope. Bitcoin is a bad idea!');
  }

  return next(action);
};

const logger = store => next => action => {
  console.group(action.type);
  console.log('The action is: ', action);
  const result = next(action);
  console.log('The new state is: ', store.getState());
  console.groupEnd();
  return result;
};

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
  }),
  Redux.applyMiddleware(checker, logger),
);

store.subscribe(() => {
  console.log('The new state is: ', store.getState());
  document.getElementById('goals').innerHTML = '';
  document.getElementById('todos').innerHTML = '';
  const { todos, goals } = store.getState();
  todos.forEach(addTodoToDOM);
  goals.forEach(addGoalToDOM);
});

function addTodo() {
  const input = document.getElementById('addTodoField');
  let name;
  if (input.value.length > 0) {
    name = input.value;
    store.dispatch(
      addTodoAction({
        name,
        completed: false,
        id: generateId(),
      }),
    );
  } else {
    alert('You must type something.');
  }
  input.value = '';
}

function addGoal() {
  const input = document.getElementById('addGoalField');
  let name;
  if (input.value.length > 0) {
    name = input.value;
    store.dispatch(
      addGoalAction({
        name,
        id: generateId(),
      }),
    );
  } else {
    alert('You must type something.');
  }
  input.value = '';
}

document.getElementById('addTodo').addEventListener('click', addTodo);
document.getElementById('addGoal').addEventListener('click', addGoal);

function addRemoveButton(onClick) {
  const node = document.createElement('button');
  node.classList.add('buttonX');
  const text = document.createTextNode('X');
  node.appendChild(text);
  node.addEventListener('click', onClick);
  return node;
}

function addTodoToDOM(todo) {
  const node = document.createElement('li');
  const checker = document.createElement('input');
  checker.setAttribute('type', 'checkbox');
  checker.id = 'myCheck';
  node.classList.add('item');
  node.appendChild(checker);
  const text = document.createTextNode(todo.name);
  node.appendChild(text);
  node.style.textDecoration = todo.completed ? 'line-through' : 'none';
  checker.addEventListener('click', e => {
    store.dispatch(toggleTodoAction(todo.id));
  });

  const removeBtn = addRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id));
  });

  node.appendChild(removeBtn);
  document.getElementById('todos').appendChild(node);
}

function addGoalToDOM(goal) {
  const node = document.createElement('li');
  node.classList.add('item');
  const text = document.createTextNode(goal.name);
  node.appendChild(text);

  const removeBtn = addRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id));
  });

  node.appendChild(removeBtn);
  document.getElementById('goals').appendChild(node);
}

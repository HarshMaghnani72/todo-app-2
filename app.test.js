const test = require('node:test');
const assert = require('node:assert');
const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  filterTodos,
  getRemainingCount
} = require('./app.js');

test('addTodo adds a new todo item', () => {
  const todos = [];
  const updated = addTodo(todos, 'Learn JavaScript');
  assert.strictEqual(updated.length, 1);
  assert.strictEqual(updated[0].text, 'Learn JavaScript');
  assert.strictEqual(updated[0].completed, false);
  assert.ok(updated[0].id);
});

test('addTodo ignores empty text', () => {
  const todos = [];
  const updated = addTodo(todos, '   ');
  assert.strictEqual(updated.length, 0);
});

test('toggleTodo toggles completed state', () => {
  const todos = [{ id: '1', text: 'Test', completed: false }];
  const toggled = toggleTodo(todos, '1');
  assert.strictEqual(toggled[0].completed, true);
  
  const untoggled = toggleTodo(toggled, '1');
  assert.strictEqual(untoggled[0].completed, false);
});

test('deleteTodo removes a todo item', () => {
  const todos = [{ id: '1', text: 'Test', completed: false }];
  const updated = deleteTodo(todos, '1');
  assert.strictEqual(updated.length, 0);
});

test('editTodo updates todo text', () => {
  const todos = [{ id: '1', text: 'Old', completed: false }];
  const updated = editTodo(todos, '1', 'New');
  assert.strictEqual(updated[0].text, 'New');
});

test('filterTodos filters by all, active, and completed', () => {
  const todos = [
    { id: '1', text: 'Task 1', completed: false },
    { id: '2', text: 'Task 2', completed: true }
  ];

  assert.strictEqual(filterTodos(todos, 'all').length, 2);
  assert.strictEqual(filterTodos(todos, 'active').length, 1);
  assert.strictEqual(filterTodos(todos, 'active')[0].text, 'Task 1');
  assert.strictEqual(filterTodos(todos, 'completed').length, 1);
  assert.strictEqual(filterTodos(todos, 'completed')[0].text, 'Task 2');
});

test('getRemainingCount returns correct count', () => {
  const todos = [
    { id: '1', text: 'Task 1', completed: false },
    { id: '2', text: 'Task 2', completed: true },
    { id: '3', text: 'Task 3', completed: false }
  ];
  assert.strictEqual(getRemainingCount(todos), 2);
});

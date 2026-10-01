// Pure logic functions
function addTodo(todos, text) {
  if (!text || !text.trim()) return todos;
  const newTodo = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
    text: text.trim(),
    completed: false
  };
  return [...todos, newTodo];
}

function toggleTodo(todos, id) {
  return todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

function deleteTodo(todos, id) {
  return todos.filter(todo => todo.id !== id);
}

function editTodo(todos, id, newText) {
  if (!newText || !newText.trim()) return todos;
  return todos.map(todo =>
    todo.id === id ? { ...todo, text: newText.trim() } : todo
  );
}

function filterTodos(todos, filter) {
  switch (filter) {
    case 'active':
      return todos.filter(t => !t.completed);
    case 'completed':
      return todos.filter(t => t.completed);
    case 'all':
    default:
      return todos;
  }
}

function getRemainingCount(todos) {
  return todos.filter(t => !t.completed).length;
}

// Browser UI and LocalStorage integration (only run if document exists)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    let todos = [];
    try {
      const saved = localStorage.getItem('todos');
      if (saved) {
        todos = JSON.parse(saved);
      }
    } catch (e) {
      todos = [];
    }

    let currentFilter = 'all';

    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const remainingCountEl = document.getElementById('remaining-count');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function saveAndRender() {
      try {
        localStorage.setItem('todos', JSON.stringify(todos));
      } catch (e) {}
      render();
    }

    function render() {
      const filtered = filterTodos(todos, currentFilter);
      list.innerHTML = '';

      if (filtered.length === 0) {
        const emptyEl = document.createElement('li');
        emptyEl.className = 'empty-state';
        emptyEl.textContent = 'No tasks found.';
        list.appendChild(emptyEl);
      } else {
        filtered.forEach(todo => {
          const li = document.createElement('li');
          li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
          li.dataset.id = todo.id;

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'todo-checkbox';
          checkbox.checked = todo.completed;
          checkbox.addEventListener('change', () => {
            todos = toggleTodo(todos, todo.id);
            saveAndRender();
          });

          const span = document.createElement('span');
          span.className = 'todo-text';
          span.textContent = todo.text;
          span.addEventListener('dblclick', () => {
            startEditing(li, todo);
          });

          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-btn';
          deleteBtn.textContent = 'Delete';
          deleteBtn.addEventListener('click', () => {
            todos = deleteTodo(todos, todo.id);
            saveAndRender();
          });

          li.appendChild(checkbox);
          li.appendChild(span);
          li.appendChild(deleteBtn);
          list.appendChild(li);
        });
      }

      remainingCountEl.textContent = getRemainingCount(todos);
    }

    function startEditing(li, todo) {
      li.classList.add('editing');
      const span = li.querySelector('.todo-text');
      const inputEdit = document.createElement('input');
      inputEdit.type = 'text';
      inputEdit.className = 'edit-input';
      inputEdit.value = todo.text;

      li.replaceChild(inputEdit, span);
      inputEdit.focus();

      function commitEdit() {
        const newText = inputEdit.value;
        if (newText.trim()) {
          todos = editTodo(todos, todo.id, newText);
          saveAndRender();
        } else {
          render();
        }
      }

      inputEdit.addEventListener('blur', commitEdit);
      inputEdit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          commitEdit();
        } else if (e.key === 'Escape') {
          render();
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value;
      if (text.trim()) {
        todos = addTodo(todos, text);
        input.value = '';
        saveAndRender();
      }
    });

    clearCompletedBtn.addEventListener('click', () => {
      todos = todos.filter(t => !t.completed);
      saveAndRender();
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
      });
    });

    render();
  });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    filterTodos,
    getRemainingCount
  };
}

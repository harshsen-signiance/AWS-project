import { useEffect, useState } from "react";
import { getTodos, addTodo, deleteTodo } from "./api";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTodos() {
    const data = await getTodos();
    setTodos(data);
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function handleAdd() {
    if (!task.trim()) return;
    setLoading(true);
    await addTodo(task);
    setTask("");
    await loadTodos();
    setLoading(false);
  }

  async function handleDelete(id) {
    await deleteTodo(id);
    await loadTodos();
  }

  return (
    <div className="container">
      <h1>Todo App</h1>

      <div className="add-box">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button className="add-btn" onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>

      <div className="todo-list">
        {todos.length === 0 && !loading ? (
          <div className="empty-state">No tasks yet. Enjoy your day!</div>
        ) : (
          todos.map((todo) => (
            <div className="todo-item" key={todo.id}>
              <span className="todo-text">{todo.task}</span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="Delete task"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <p className="footer">
        Powered by AWS • S3 • EC2 • RDS
      </p>
    </div>
  );
}

export default App;
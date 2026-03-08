import { useEffect, useState } from "react";
import { getTodos, addTodo, deleteTodo } from "./api";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadTodos() {
    try {
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError("Failed to load tasks. Check your connection.");
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function handleAdd() {
    if (!task.trim()) return;
    setLoading(true);
    try {
      await addTodo(task);
      setTask("");
      await loadTodos();
    } catch (err) {
      setError("Failed to add task. Please try again.");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      await loadTodos();
    } catch (err) {
      setError("Failed to delete task. Please try again.");
    }
  }

  return (
    <div className="container">
      <h1>Todo App</h1>

      <div className="add-box">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="What needs to be done?"
        />
        <button className="add-btn" onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button className="retry-btn" onClick={loadTodos}>Retry</button>
        </div>
      )}

      <div className="todo-list">
        {todos.length === 0 && !loading && !error ? (
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
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
      <h1>Todo App (3-Tier)</h1>

      <div className="add-box">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={handleAdd} disabled={loading}>
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.task}</span>
            <button onClick={() => handleDelete(todo.id)}>❌</button>
          </li>
        ))}
      </ul>

      <p className="footer">
        Frontend: S3 • Backend: EC2 + ALB • DB: RDS
      </p>
    </div>
  );
}

export default App;
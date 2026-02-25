import { useEffect, useState } from "react";

const API_BASE = "http://alb-harsh-279325154.us-east-1.elb.amazonaws.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error(err));
  }, []);

  const addTodo = async () => {
    await fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task })
    });

    const res = await fetch(`${API_BASE}/todos`);
    setTodos(await res.json());
    setTask("");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Todo App (3-Tier)</h1>

      <input
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(t => (
          <li key={t.id}>{t.task}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
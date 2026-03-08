const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://alb-harsh-279325154.us-east-1.elb.amazonaws.com";

export async function getTodos() {
  try {
    const res = await fetch(`${API_BASE}/todos`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getTodos failed:", err.message);
    throw err;
  }
}

export async function addTodo(task) {
  try {
    const res = await fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task }),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  } catch (err) {
    console.error("❌ addTodo failed:", err.message);
    throw err;
  }
}

export async function deleteTodo(id) {
  try {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
  } catch (err) {
    console.error("❌ deleteTodo failed:", err.message);
    throw err;
  }
}
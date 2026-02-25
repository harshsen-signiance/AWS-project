const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://alb-harsh-279325154.us-east-1.elb.amazonaws.com";

export async function getTodos() {
  const res = await fetch(`${API_BASE}/todos`);
  return res.json();
}

export async function addTodo(task) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });
  return res.json();
}

export async function deleteTodo(id) {
  await fetch(`${API_BASE}/todos/${id}`, {
    method: "DELETE",
  });
}
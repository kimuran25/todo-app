import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const addTodo = () => {
    if (!input) return;

    fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: input }),
    })
      .then((res) => res.json())
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        setInput("");
      });
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:5000/todos/${id}`, { method: "DELETE" }).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  };

  const toggleTodo = (id) => {
    fetch(`http://localhost:5000/todos/${id}/toggle`, { method: "PATCH" })
      .then((res) => res.json())
      .then((updatedTodo) => {
        setTodos(
          todos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          )
        );
      });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ToDoアプリ</h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="やることを入力"
        />
        <button onClick={addTodo}>追加</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              type="checkbox"
              checked={todo.is_done}
              onChange={() => toggleTodo(todo.id)}
              style={{ marginRight: "0.5rem" }}
            />
            <span style={{ textDecoration: todo.is_done ? "line-through" : "none", flexGrow: 1 }}>
              {todo.task}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
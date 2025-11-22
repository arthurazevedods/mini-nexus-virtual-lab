import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Carregando...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/ping/")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Erro ao conectar com o servidor 😢");
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Mini-Nexus Virtual Lab Client</h1>
      <p>Resposta do backend:</p>
      <pre>{message}</pre>
    </div>
  );
}

export default App;

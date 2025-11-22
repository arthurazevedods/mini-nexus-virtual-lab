import { useEffect, useState } from "react";

type Space = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

function App() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/spaces/")
      .then((res) => res.json())
      .then((data) => {
        setSpaces(data.spaces);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar espaços");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Carregando espaços...</div>;
  }

  if (error) {
    return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Lobby – Nexus-Virtual-Lab</h1>
      <p>Escolha um espaço para entrar:</p>

      {spaces.length === 0 && <p>Nenhum espaço disponível.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {spaces.map((space) => (
          <li
            key={space.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            <h2 style={{ margin: 0 }}>{space.name}</h2>
            <p style={{ margin: "0.25rem 0", color: "#555" }}>
              <strong>Slug:</strong> {space.slug}
            </p>
            <p style={{ margin: "0.25rem 0" }}>{space.description}</p>
            {/* No futuro: botão "Entrar" que leva para /space/:slug */}
            <button
              onClick={() => alert(`Entrar no espaço: ${space.slug} (em breve)`)}
              style={{ marginTop: "0.5rem" }}
            >
              Entrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

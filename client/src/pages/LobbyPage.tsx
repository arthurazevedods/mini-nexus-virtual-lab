// @mini-nexus-virtual-lab/client/src/pages/LobbyPage.tsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

type Space = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

async function fetchSpaces(): Promise<Space[]> {
  const res = await fetch("http://127.0.0.1:8000/api/spaces/");
  if (!res.ok) {
    throw new Error("Erro ao buscar espaços");
  }
  const data = await res.json();
  return data.spaces;
}

export function LobbyPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchSpaces,
  });

  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Carregando espaços...</div>;
  }

  if (isError) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        Erro ao carregar espaços: {(error as Error).message}
      </div>
    );
  }

  const spaces = data ?? [];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Lobby – Mini Nexus Virtual Lab</h1>
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

            <Link
              to="/space/$slug"
              params={{ slug: space.slug }}
              style={{
                display: "inline-block",
                marginTop: "0.5rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                border: "1px solid #444",
                textDecoration: "none",
              }}
            >
              Entrar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

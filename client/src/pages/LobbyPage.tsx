import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useCurrentUser } from "../hooks/useCurrentUser";

type Space = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

async function fetchSpaces(): Promise<Space[]> {
  const res = await fetch("http://localhost:8000/api/spaces/", {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Erro ao buscar espaços");
  }
  const data = await res.json();
  return data.spaces;
}

export function LobbyPage() {
  // 🔹 Hook 1: usuário atual (sempre chamado)
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useCurrentUser();

  // 🔹 Hook 2: lista de espaços (sempre chamado)
  const {
    data: spacesData,
    isLoading: isLoadingSpaces,
    isError: isSpacesError,
    error: spacesError,
  } = useQuery<Space[]>({
    queryKey: ["spaces"],
    queryFn: fetchSpaces,
  });

  const spaces = spacesData ?? [];

  // 🔹 Só depois dos hooks vêm os `if` de estado

  if (isLoadingUser || isLoadingSpaces) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (isUserError) {
    // Se der erro no /auth/me, tratamos como "não logado", mas não quebramos a tela
    console.error("Erro ao carregar usuário atual");
  }

  if (isSpacesError) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Lobby – Mini Nexus Virtual Lab</h1>
        {currentUser ? (
          <p>
            Logado como: <strong>{currentUser.username}</strong>
          </p>
        ) : (
          <p>
            Você não está logado. <Link to="/login">Fazer login</Link>
          </p>
        )}
        <p style={{ color: "red", marginTop: "1rem" }}>
          Erro ao carregar espaços:{" "}
          {spacesError instanceof Error ? spacesError.message : "Erro desconhecido"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Lobby – Mini Nexus Virtual Lab</h1>

      {currentUser ? (
        <p>
          Logado como: <strong>{currentUser.username}</strong>{" "}
          (<Link to="/login">trocar usuário</Link>)
        </p>
      ) : (
        <p>
          Você não está logado. <Link to="/login">Fazer login</Link>
        </p>
      )}

      <p style={{ marginTop: "1rem" }}>Escolha um espaço para entrar:</p>

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

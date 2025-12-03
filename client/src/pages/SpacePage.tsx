// @mini-nexus-virtual-lab/client/src/pages/SpacePage.tsx
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";

type Space = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

async function fetchSpace(slug: string): Promise<Space> {
  const res = await fetch(`http://127.0.0.1:8000/api/spaces/${slug}/`);
  if (!res.ok) {
    throw new Error("Espaço não encontrado ou erro ao carregar");
  }
  return res.json();
}

export function SpacePage() {
  // Pega o slug da URL de forma tipada
  const { slug } = useParams({ from: "/space/$slug" });

  const {
    data: space,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["space", slug],
    queryFn: () => fetchSpace(slug),
  });

  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Carregando espaço...</div>;
  }

  if (isError || !space) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "red" }}>
          {error instanceof Error ? error.message : "Erro ao carregar espaço"}
        </p>
        <Link to="/">← Voltar ao Lobby</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Link to="/">← Voltar ao Lobby</Link>
      <h1>{space.name}</h1>
      <p>
        <strong>Slug:</strong> {space.slug}
      </p>
      <p>{space.description}</p>

      <hr style={{ margin: "1.5rem 0" }} />

      <p>
        Aqui futuramente entra:
        <ul>
          <li>Mapa 2D do espaço</li>
          <li>Lista de pessoas presentes</li>
          <li>Chat / interações em tempo real</li>
        </ul>
      </p>
    </div>
  );
}

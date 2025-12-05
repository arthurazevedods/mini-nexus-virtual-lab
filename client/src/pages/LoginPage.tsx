import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginRequest, fetchCurrentUser } from "../lib/authClient";

type CurrentUser = {
  id: number;
  username: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Consulta o usuário atual (se já estiver logado via sessão)
  const {
    data: currentUser,
    isLoading: isLoadingMe,
    isFetching: isFetchingMe,
  } = useQuery<CurrentUser | null>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    // não precisa rodar em background o tempo todo aqui,
    // o resto do app pode reaproveitar o cache
    staleTime: 60_000,
  });

  // Se já estiver logado, redireciona pro lobby
  useEffect(() => {
    if (currentUser) {
      navigate({ to: "/", replace: true });
    }
  }, [currentUser, navigate]);

  const loginMutation = useMutation({
    mutationFn: () => loginRequest(username, password),
    onSuccess: async () => {
      setFormError(null);
      // Garante que a info do usuário atual seja atualizada
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate({ to: "/", replace: true });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Erro inesperado ao fazer login");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setFormError("Preencha usuário e senha");
      return;
    }
    loginMutation.mutate();
  };

  const isCheckingSession = isLoadingMe || isFetchingMe;

  // Enquanto checa se já está logado, mostra um loading simples
  if (isCheckingSession && !currentUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <p>Verificando sessão...</p>
      </div>
    );
  }

  // Se já está logado, o useEffect vai redirecionar.
  // Esse return é só um fallback visual rápido.
  if (currentUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <p>Você já está logado como <strong>{currentUser.username}</strong>. Redirecionando...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "2rem",
          width: "320px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "1rem" }}>
          Login – Mini Nexus Virtual Lab
        </h1>

        <label style={{ display: "block", marginBottom: "0.75rem" }}>
          Usuário
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.25rem",
              padding: "0.45rem 0.6rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            autoComplete="username"
          />
        </label>

        <label style={{ display: "block", marginBottom: "0.75rem" }}>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.25rem",
              padding: "0.45rem 0.6rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            autoComplete="current-password"
          />
        </label>

        {formError && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          style={{
            width: "100%",
            marginTop: "1rem",
            padding: "0.6rem",
            borderRadius: "6px",
            border: "none",
            background: "#222",
            color: "#fff",
            cursor: loginMutation.isPending ? "default" : "pointer",
            opacity: loginMutation.isPending ? 0.7 : 1,
          }}
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar"}
        </button>

        <p style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
          Use o usuário criado no Django (por exemplo, <code>admin</code>).
        </p>

        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
          <Link to="/">Voltar ao Lobby</Link>
        </p>
      </form>
    </div>
  );
}

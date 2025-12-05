// @mini-nexus-virtual-lab/client/src/lib/authClient.ts

const API_BASE = "http://127.0.0.1:8000/api";

function getCookie(name: string): string | null {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return value ? decodeURIComponent(value.split("=")[1]) : null;
}

export async function ensureCsrfToken(): Promise<string> {
  let token = getCookie("csrftoken");
  if (!token) {
    await fetch(`${API_BASE}/auth/csrf/`, {
      credentials: "include",
    });
    token = getCookie("csrftoken");
  }
  if (!token) {
    throw new Error("CSRF token not found");
  }
  return token;
}

export async function loginRequest(username: string, password: string) {
  const csrfToken = await ensureCsrfToken();

  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    credentials: "include", // MUITO importante para enviar/receber cookies
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Erro ao fazer login");
  }

  return res.json();
}

export async function logoutRequest() {
  const csrfToken = await ensureCsrfToken();

  const res = await fetch(`${API_BASE}/auth/logout/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao sair");
  }

  return res.json();
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me/`, {
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Erro ao buscar usuário atual");
  }

  return res.json();
}

import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { LobbyPage } from "./pages/LobbyPage";
import { SpacePage } from "./pages/SpacePage";
import { LoginPage } from "./pages/LoginPage"; // <- novo

function RootLayout() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const lobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LobbyPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const spaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/space/$slug",
  component: SpacePage,
});

const routeTree = rootRoute.addChildren([
  lobbyRoute,
  loginRoute,
  spaceRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

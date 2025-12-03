// @mini-nexus-virtual-lab/client/src/router.tsx
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { LobbyPage } from "./pages/LobbyPage";
import { SpacePage } from "./pages/SpacePage";

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

const spaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/space/$slug",
  component: SpacePage,
});

const routeTree = rootRoute.addChildren([lobbyRoute, spaceRoute]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

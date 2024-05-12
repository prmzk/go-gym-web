import { useAuth } from "./lib/auth";
import { RouterProvider } from "@tanstack/react-router";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./lib/auth";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: { queryClient, auth: undefined },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const auth = useAuth();
  return (
    <main className="dark bg-background min-h-svh">
      <RouterProvider router={router} context={{ auth }} />
    </main>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

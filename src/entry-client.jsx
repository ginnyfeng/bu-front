import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { routes } from "./App";

function hydrate() {
  const router = createBrowserRouter(routes);

  return hydrateRoot(
    document.getElementById("root"),
    <RouterProvider router={router} fallbackElement={null} />
  );
}
hydrate();

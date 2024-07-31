import { Navigate, Outlet } from "react-router-dom";

import HistoryProvider from "./utils/History";

import { Home } from "./pages/home";
import { BlogAndBeyond } from "./pages/blogAndBeyond";
import { Contribute } from "./pages/contribute";
import { LetsTalk } from "./pages/letsTalk";
import { Resources } from "./pages/resources";
import { S4YT } from "./pages/s4yt";
import { Error404, Error500 } from "./pages/errors";

import "./index.css";

export const routes = [
  {
    path: "/",
    element: (
      <>
        <HistoryProvider />
        <Outlet />
      </>
    ),
    children: [
      {
        index: true,
        path: "home",
        element: <Home />,
      },
      {
        path: "blog",
        element: <BlogAndBeyond />,
      },
      {
        path: "contribute",
        element: <Contribute />,
      },
      {
        path: "lets-talk",
        element: <LetsTalk />,
      },
      {
        path: "resources",
        element: <Resources />,
      },
      {
        path: "s4yt",
        element: <S4YT />,
      },
      // {
      //   path: "support",
      //   element: <Support />,
      // },
      {
        path: "error-404",
        element: <Error404 />,
      },
      {
        path: "error-500",
        element: <Error500 />,
      },
      {
        ...(typeof window !== "undefined" && {
          path: "*",
          element: <Navigate to="/error-404" replace />,
        }),
      },
    ],
  },
];

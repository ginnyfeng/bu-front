/**
 * Server Side Rendering Server
 * 
 * Author: David Bishop
 * 
 * Description:
 * Dynamic Site Generation for pages, redirects, etc.
 */

import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import sirv from "sirv";

const { PROTOCOL, HOST, PORT: ENV_PORT } = process.env,
  PORT = Number(ENV_PORT) || 3000;

async function setupServer() {
  const app = express();
  let vite;

  if (process.env.NODE_ENV === "development") {
    const { createServer } = await import("vite");
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);
    app.use(morgan("dev"));
  } else {
    app.use(
      sirv("build/client", {
        gzip: true,
      })
    );
  }

  app.get("/*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template, render;

      if (process.env.NODE_ENV === "development") {
        template = fs.readFileSync(path.resolve("./index.html"), "utf-8");
        console.log("template", template);

        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("./src/entry-server")).render;
      } else {
        template = fs.readFileSync(
          path.resolve("./build/client/index.html"),
          "utf-8"
        );
        render = (await import("./build/ssr/entry-server")).render;
      }

      try {
        const appHtml = await render(req, res),
          html = template.replace("<!--ssr-outlet-->", appHtml)
          // console.log("appHtml", appHtml);
          // console.log("html", html);

        return res.status(200).setHeader("Content-Type", "text/html").end(html);
      } catch (error) {
        redirect(error, res)
        throw error;
      }
    } catch (error) {
      process.env.NODE_ENV === "development" && vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  return app;
}

function redirect(error, res) {
  if ("statusCode" in error && "location" in error) {
    if (error.statusCode === 404) return res.redirect("/error-404");
    else if (error.location.pathname === "/") return res.redirect("/home");
    
  } else if (
    error instanceof Response &&
    error.status >= 300 &&
    error.status <= 399
  ) {
    return res.redirect(
      error.status,
      error.headers.get("Location") || ""
    );
  }
}

setupServer().then((app) =>
  app.listen(PORT, HOST, () =>
    console.log(
      `Server is running on ${PROTOCOL}${HOST}:${PORT}; Ctrl-C to terminate...`
    )
  )
);

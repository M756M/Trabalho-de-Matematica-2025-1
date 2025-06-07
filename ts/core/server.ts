import { createServer } from "http";

import settings from "./config.js";
import handleRequest from "./routes.js";

import { Route } from "./routing.js";

Route.use(settings);

const server = createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", `${settings.protocol}://${settings.hostname}:${settings.frontendPort}`);
    
    return handleRequest(req, res);
});

server.listen(settings.port, settings.hostname);
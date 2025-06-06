import { createServer } from "http";

import Settings from "./config.js";
import { processRequest } from "./routes.js";

const server = createServer((req, res) => {
    if(req.url == ""){};
});

server.listen(Settings.PORT, Settings.HOSTNAME);

fetch("localhost:8800/process/?tensionA=1&tensionB=2&resistance1=3&resistance2=4&resistance3=4&resistance4=5&resistance5=6");
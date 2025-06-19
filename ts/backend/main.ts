import { createServer } from "http";
import { execFile } from "child_process";

const port = 8080;
const host = "127.0.0.1";

const server = createServer();
const octavePath = "./env/octave-10.2.0/mingw64/bin/octave-cli-10.2.0.exe";

server.on("request", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  execFile(octavePath, ["src/octave/main.m", req.url!.replace("/?", "")], (_, output) => {
    res.write(output);
    res.end();
  })

  return;
});

server.listen(port, host);
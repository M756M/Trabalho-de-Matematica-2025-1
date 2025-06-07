import type { IncomingMessage, ServerResponse } from "http";

import { execFile } from "child_process";

import { Route } from "./routing.js";

export function handleRequest(req: IncomingMessage, res: ServerResponse){
    const url = new Route(req.url!);

    url.associate(/^\/process\/\?va=\d+&vb=\d+&r1=\d+&r2=\d+&r3=\d+&r4=\d+&r5=\d+/, processInput);

    url.process(req, res);
};

function processInput(this: Route, req: IncomingMessage, res: ServerResponse){
    const inputData = this.params.map((name, value) => `${name}:${value}`);

    execFile(Route.settings.bin, [Route.settings.entry, ...inputData], (error, output) => {
        if(error){
            console.log(error);
            return;
        };
        res.write(output, (err) => err ? console.log(err) : void(0));
        res.end();
    });
};

export default handleRequest;
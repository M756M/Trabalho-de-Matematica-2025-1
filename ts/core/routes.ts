import type { Server } from "http";
import { IncomingMessage, ServerResponse } from "http";

import { readFileSync } from "fs";

import { execFile as _execFile } from "child_process";
import { promisify } from "util";

import Settings from "./config.js";
import { handleOutput } from "./process.js";

const execFile = promisify(_execFile);

function root(req: IncomingMessage, res: ServerResponse){
    const data = readFileSync(Settings.ROOTS.html + "main.html", "utf-8");

    res.write(data);
};

function css(req: IncomingMessage, res: ServerResponse){
    const file = req.url!.match(/\/css\/(.*\.css)$/)![1];
    const stylesheet = readFileSync(Settings.ROOTS.css + file, "utf-8");

    res.write(stylesheet);
};

function js(req: IncomingMessage, res: ServerResponse){
    const file = req.url!.match(/\/js\/(.*\.js)$/)![1];
    const script = readFileSync(Settings.ROOTS.js + file, "utf-8");

    res.write(script);
};

export async function processRequest(server: Server, req: IncomingMessage, res: ServerResponse){
    const url = req.url!;

    if(/^\/$/.test(url)) root(req, res);
    if(/^\/.*\.css$/.test(url)) css(req, res);
    if(/^\/.*\.js$/.test(url)) js(req, res);

    if(/\/?tensionA=\d+&tensionB=\d+&resistance1=\d+&resistance2=\d+&resistance3=\d+&resistance4=\d+&resistance5=\d+/.test(url)){
        const htmlData = readFileSync(Settings.ROOTS.html + "main.html", "utf-8" );
        res.write(htmlData);

        const searchParams = new URL(`${Settings.HOSTNAME}:${Settings.PORT}` + req.url).searchParams;
        const inputData = [];

        for (let [name, value] of searchParams.entries()){
            inputData.push(`${name}:${value}`);
        };

        const { stdout, stderr } = await execFile(Settings.BACKEND_CORE, [Settings.BACKEND_ENTRY, ...inputData]);
        
        const [current1, current2, current3] = handleOutput(stdout, stderr);

        res.write(`
            <textarea id="answer">${current1}, ${current2}, ${current3}</textarea>
        `);
    };

    res.end();
};
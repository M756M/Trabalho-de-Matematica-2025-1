import type { IncomingMessage, ServerResponse } from "http";

type Settings = {
    protocol: string,
    port: number,
    hostname: string,
    bin: string,
    entry: string,
};

type ServerTransaction = (this: Route, req: IncomingMessage, res: ServerResponse) => void;

class RouteParams {
    private readonly params: { [name: string]: string } = {};

    public constructor(url: string){
        if(!/\?(.+)/.test(url)) return;

        const params = url
            .match(/\?(.+)/)![1].split("&")
            .map((pair) => pair.split("=") as [string, string])
            .filter((tuple) => tuple.length > 1);

        for(const [name, value] of params) this.params[name] = value;

        return;
    };

    public join(separator?: string){
        const pairs = [];

        for(const name in this.params){
            pairs.push(`${name}:${this.params[name]}`);
        };
        return pairs.join(separator ?? ",");
    };

    public map<T>(fn: (name: string, value: string) => T){
        const pairs = [];
        for(const name in this.params) pairs.push(fn(name, this.params[name]));
        return pairs;
    };

    public [Symbol.iterator](){
        const keys = Object.keys(this.params);
        const params = Object.assign({}, this.params);

        let index = 0;

        return {
            next(this: RouteParams): IteratorResult<[string, string]> {
                if(index < keys.length){
                    return { done: false, value: [keys[index], params[keys[index++]]] }
                }
                else return { done:true, value: [keys[index], params[keys[index]]] };
            }
        };
    };
};

export class Route {
    private static _settings: Settings;

    public readonly url: `${typeof Route.socket}/${string}`;
    public readonly params: RouteParams;

    private readonly listeners: { [name: string]: ServerTransaction } = {};

    public constructor(path: string){
        this.url = `${Route._settings.protocol}://${Route._settings.hostname}:${Route._settings.port}/${path.replace(/^\//, "")}`;
        this.params = new RouteParams(this.url);

        return;
    };

    public static get settings(){
        return Object.freeze(this._settings);
    };

    private static get socket(){
        return `${Route._settings.protocol}://${Route._settings.hostname}:${Route._settings.port}` as const;
    };

    public matches(pattern: RegExp){
        return pattern.test(this.url.replace(Route.socket, ""));
    };

    public associate(pattern: RegExp, listener: ServerTransaction){
        this.listeners[pattern.source] = listener;

        return;
    };

    public process(req: IncomingMessage, res: ServerResponse){
        for (let name in this.listeners){
            if(this.matches(RegExp(name))) this.listeners[name].bind(this)(req, res);
        };

        return;
    };

    public async get<T>(listener: (res: string) => T): Promise<T>{
        const routeData = await fetch(this.url);
        const stringifiedData = String.fromCharCode(...await routeData.bytes());

        return listener(stringifiedData);
    };

    public static use(settings: Settings){
        if(!["port", "hostname", "bin", "protocol", "entry"].every((key) => Object.keys(settings).includes(key))){
            throw TypeError("Invalid setting: Non-conforming set of keys");
        };

        this._settings = settings;
        return this;
    };

    public static fromIterator<E extends { name: string, value: string }>(base: string, iterable: Iterable<E>){
        const url = [];
        
        for(const element of iterable) url.push(`${element.name}=${element.value}`);

        return new Route(`${base}/?${url.join("&")}`);
    };
};
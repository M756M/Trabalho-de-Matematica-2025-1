const Settings = Object.freeze({
    PORT: 8800,
    HOSTNAME: "localhost",
    BACKEND_CORE: "env/octave-10.2.0/mingw64/bin/octave-cli-10.2.0.exe",
    BACKEND_ENTRY: "src/octave/main.m",

    ROOTS: Object.freeze({
        html: "public/html/",
        css: "public/css/",
        js: "public/js/"
    }),
});

export default Settings;
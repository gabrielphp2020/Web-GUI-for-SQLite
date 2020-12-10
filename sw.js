const CACHE_VERSION_ANTERIOR = 1; //subo aqui para no tener problemas :D
const CACHE_VERSION = CACHE_VERSION_ANTERIOR + 1;
const APP = "Web-GUI-for-SQLite";
const CACHE_INMUTABLE = "CACHE_INMUTABLE_" + APP;
const CACHE_SHELL = "CACHE_SHELL_" + APP;
const CACHE_DINAMICO = "CACHE_DINAMICO_" + APP;
const INMUTABLES = [
    //como no va cambiar mejor que se descargue solo una vez :)


];
const SHELL = [

    "index.html",
    "Web-GUI-for-SQLite.css",
    "Web-GUI-for-SQLite.js",

    "external/a11y-dialog/a11y-dialog.js",
    "external/a11y-dialog/a11y-dialog.min.js",
    "external/a11y-dialog/package.json",
    "external/codemirror/codemirror.css",
    "external/codemirror/codemirror.js",
    "external/codemirror/mode/sql/index.html",
    "external/codemirror/mode/sql/sql.js",

    "external/sql/sql.js",

    "image/error.png",
    "image/minus.png",
    "image/plus.png",
    "image/preview.png",
    "image/update.png",

    "images/icons/icon-144x144.png",
    "images/icons/icon-512x512.png",
    "sw.js",
    "manifest.json"



];


self.addEventListener('install', e => {

    var inmutables = self.FetchCache(CACHE_INMUTABLE, INMUTABLES, true);
    var shell = self.FetchCache(CACHE_SHELL + CACHE_VERSION, SHELL);
    console.log("installing version " + CACHE_VERSION);
    e.waitUntil(Promise.all([inmutables, shell]));

});


self.addEventListener('activate', e => {
    console.log("uninstalling version " + CACHE_VERSION_ANTERIOR);
    e.waitUntil(Promise.all([
        caches.delete(CACHE_SHELL + CACHE_VERSION_ANTERIOR),
        caches.delete(CACHE_DINAMICO + CACHE_VERSION_ANTERIOR)
    ]));

});

self.addEventListener('fetch', e => {

    e.respondWith(caches.match(e.request).then(resp => {
        var respuesta;
        if (resp)
            respuesta = resp;
        else {
            respuesta = fetch(e.request)
                .then(data => {
                    return caches.open(CACHE_DINAMICO + CACHE_VERSION)
                        .then(cache => {
                            cache.put(e.request, data.clone());
                            return data;
                        });
                });
        }
        return respuesta;

    }));

});



function FetchCache(cache_name, urls, ifNotExist = false) {
    return caches.open(cache_name)
        .then(cache => {
            if (ifNotExist)
                cache.match(urls[0]).then((match) => { if (!match) cache.addAll(urls); });
            else cache.addAll(urls);
        });
}

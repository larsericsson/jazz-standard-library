"use strict";
window.onload = function() {
    console.log("load");
    var sp = getSpotifyApi();
    var models = sp.require('$api/models');

    function htmlEscape(str) {
        return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }

    function tabs() {
        console.log("tabs");
        var args = models.application.arguments;
        if (args) {
            var lastArg = args[args.length - 1];
            if (lastArg !== 'index' && lastArg !== 'about') {
                console.log("yes");
                return;
           }
       }

        // compose file
        var file = args.length == 1 ? (args[0] + '.html') : '/tutorials/' + args.slice(0, args.length-1).join('/') + '.html';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4 || xhr.status != 200) return;

            var wrapper = document.getElementById('wrapper');
            wrapper.innerHTML = args[0] === 'index' ? '' : '<ul class="breadcrumb"><li><a href="spotify:app:tutorial:index">&laquo; Back to main page</a></li></ul>';
            wrapper.innerHTML += xhr.responseText;

            window.scrollTo(0, 0);
            var htmlSnippets = wrapper.querySelectorAll(".html-snippet");
            for (i = 0; i < htmlSnippets.length; i++) {
                container = htmlSnippets[i].getAttribute("data-container");
                if (container) {
                    document.getElementById(container).innerHTML = '<pre><code data-language="html">' + htmlEscape(htmlSnippets[i].innerHTML) + '</code></pre>';
                }
            }

            // search js snippets
            var scripts = wrapper.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].getAttribute('type') == 'script/snippet') {
                    var dataExecute = scripts[i].getAttribute('data-execute');
                    if (!dataExecute || dataExecute != 'no') {
                        eval(scripts[i].innerHTML);
                    }
                    var container = scripts[i].getAttribute("data-container");
                    if (container) {
                        document.getElementById(container).innerHTML = '<pre><code data-language="javascript">' + htmlEscape(scripts[i].innerHTML) + '</code></pre>';
                    }
                }
            }

            // search html snippets
            Rainbow.color();
        };
        xhr.send(null);
    }

    function search(search, cb) {

        var xhr = new XMLHttpRequest(), API_KEY = 'FILDTEOIK2HBORODV',
            url = 'http://developer.echonest.com/api/v4/song/search?api_key='+API_KEY+'&format=json&results=3'
                +'&bucket=id:spotify-WW&bucket=tracks&limit=true&bucket=audio_summary';

        if (search.hasOwnProperty('title')) {
            url += '&title='+search.title;
        }
        if (search.hasOwnProperty('key')) {
            url += '&key='+search.key;
        }

        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4 || xhr.status != 200) return;
            'function' === typeof cb && cb(JSON.parse(xhr.responseText));
        };
        xhr.send(null);
    }

    var searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        search({
            title: document.getElementById('searchField').value
        }, function (res) {
            var wrapper = document.getElementById('results');
            wrapper.innerHTML += JSON.stringify(res);
        });
        return true;
    }, false);


    models.application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);
};

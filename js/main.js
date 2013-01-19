"use strict";
window.onload = function() {
    var sp = getSpotifyApi();
    var models = sp.require('$api/models');

    function test(args) {
        console.log('test', args);
    }

    function tabs(args) {
        var current = document.getElementById((args && args.length > 0) ? args[0] : 'index');
        var sections = document.getElementsByClassName('section');
        for (var i=0, l = sections.length; i<l; i++) {
            if (current != sections[i]) {
                sections[i].style.display = 'none';
            }
        }
        current.style.display = 'block';
    }

    function inpoint() {
        var router = {
            tabs: tabs,
            test: test
        }, args = models.application.arguments;

        if (args.length > 0 && router.hasOwnProperty(args[0])) {
            router[args[0]](args.slice(1, args.length));
        } else {
            tabs(args);
        }
    }
    models.application.observe(models.EVENT.ARGUMENTSCHANGED, inpoint);
    tabs();


/*
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
*/
};

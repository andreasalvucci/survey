const PORT = process.env.PORT || 3000;
var needle = require('needle');
var express = require('express');
var app = express().use(express.static(__dirname + '/'));
var http = require('http').Server(app);

app.get("/", function(request, response) {
    response.sendFile(__dirname + "index2.html");
});
app.use(express.static(__dirname + "/public", {
    index: false,
    immutable: true,
    cacheControl: true,
    maxAge: "30d"
}));

app.get('/hibp', (req, res) => {
    var sanitizer = require('string-sanitizer')
    var url_encoded_email = req.query.email
    email = decodeURIComponent(url_encoded_email)
    console.log("SERVER: EMAIL: " + email)
    if (!sanitizer.validate.isEmail(email)) {
        res.json({ "error": "bad e-mail" })
    }
    var url = 'https://haveibeenpwned.com/api/v3/breachedaccount/' + email
    var options = {
        accept: 'application/json',
        content_type: 'application/json',
        headers: {
            'hibp-api-key': '06d8f69641eb43209225729887699b81',
            'user-agent': 'myApp'
        }
    }

    needle('get', url, options)
        .then(function(resp) {
            console.log(resp.body);
            if (resp.body.length == 0) {
                console.log('Non e stata trovata nessuna mail');
                res.json({ "ok": "ok" });
            } else {
                res.send(resp.body);
            }
        })
        .catch(e => console.log(e))

});

app.get('/extbreaches', (req, res) => {
    var sanitizer = require('string-sanitizer')
    var url_encoded_email = req.query.email
    email = decodeURIComponent(url_encoded_email)
    console.log("SERVER: EMAIL: " + email)
    if (!sanitizer.validate.isEmail(email)) {
        res.json({ "error": "bad e-mail" })
    }
    var url = 'https://haveibeenpwned.com/api/v3/breachedaccount/' + email
    var options = {
        accept: 'application/json',
        content_type: 'application/json',
        headers: {
            'hibp-api-key': '06d8f69641eb43209225729887699b81',
            'user-agent': 'myApp'
        }
    }

    needle('get', url, options)
        .then(function(resp) {
            //console.log(resp.body);
            if (resp.body.length == 0) {
                console.log('Non e stata trovata nessuna mail');
                res.json({ "ok": "ok" });
            } else {
                var listaInfo = [];
                console.log("resp.body");
                for (i in resp.body) {
                    breachName = resp.body[i].Name;
                    console.log("Ottengo informazioni per il breach chiamato " + breachName);

                    url2 = "https://haveibeenpwned.com/api/v2/breach/" + breachName;

                    fetch(url2)
                        .then(response => {
                            response.json();
                            listaInfo.push(response.json());

                        })
                        .then(data => {
                            console.log(listaInfo)
                        })
                        .catch(e => console.log(e));

                }
                res.send(listaInfo);
            }
        })
        .catch(e => console.log(e))

});



http.listen(PORT, function() {
    console.log("Node server listening on port " + PORT);
});
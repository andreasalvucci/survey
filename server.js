var port = 8080,
express = require('express'),
app = express().use(express.static(__dirname + '/')),
http = require('http').Server(app);

app.get("/", function(request, response) {
  response.sendFile(__dirname + "./index.html");
});

http.listen(port, function(){
    console.log("Node server listening on port " + port);
});

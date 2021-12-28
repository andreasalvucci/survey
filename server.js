var port = 8080;
var needle = require('needle');
var express = require('express');
var app = express().use(express.static(__dirname + '/'));
var http = require('http').Server(app);

app.get("/", function(request, response) {
  response.sendFile(__dirname + "index.html");
});

app.get('/hibp', (req, res) => {
  var sanitizer = require('string-sanitizer')
  var email = req.query.email
  console.log("SERVER: EMAIL: " + email)
  if(!sanitizer.validate.isEmail(email)){
    res.json({"error":"bad e-mail"})
  }
  var url='https://haveibeenpwned.com/api/v3/breachedaccount/'+email
  var options={
    accept: 'application/json',
    content_type: 'application/json',
    headers: {
      'hibp-api-key': '06d8f69641eb43209225729887699b81',
      'user-agent':'myApp'
    }
  }

  needle('get',url,options)
  .then(function(resp){
    console.log(resp.body);
    if(resp.body.length==0){
      console.log('Non e stata trovata nessuna mail');
      res.json({"ok":"ok"});
    }
    else {
      res.send(resp.body);
    }
  })
  .catch(e=>console.log(e))

});

http.listen(port, function(){
    console.log("Node server listening on port " + port);
});

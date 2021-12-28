const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
var needle = require('needle');

const app = express();

const request = require('request')
const port = 3000;


let books = [];

app.use(cors());


var headers={
    'hibp-api-key': '06d8f69641eb43209225729887699b81',
    'user-agent':'myApp'
  }
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 


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
      




app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
// grab the packages we need
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const wav = require('wav');
const outFile = 'demo.wav';
const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//  Connect all our routes to our application
app.use('/', routes);

// Turn on that server!
app.listen(port, () =>
          console.log('Server started! At http://localhost:' + port));
app.use(express.static(path.join(__dirname, '/')));

var express = require('express');
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var wav = require('wav');
var FileReader = require('filereader')
var bp = require('body-parser')
var port = 4000;
var outFile = 'demo.wav';
var app = express();


app.listen(port);


module.exports = function(app) {

  // todoList Routes
  app.route('/api')
    .post(todoList.create_a_task);


app.get('/blob', function(req, res){
  res.render('data');
});

console.log('server open on port ' + port);

fs.writeFileSync('test.wav', Buffer.from(new Uint8Array(blob)));
}

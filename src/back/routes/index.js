const routes = require('express').Router();
const fs = require('fs');

routes.post('/blob', function(req, res) {
  console.log('req.body', req.body);
  console.log('req.body.blob.blob', req.body.blob.blob);
  const FILE_NAME = 'audio.wav';
  fs.writeFileSync(FILE_NAME, Buffer.from(new Uint8Array(req.body.blob.blob)));
  getVolume(FILE_NAME, volume => res.send(volume));
});

routes.get('/', (req, res) => {
  console.log('title');
  res.send('hello');
});

function getVolume(fileName, callback) {
  var spawn = require("child_process").spawn;
  var process = spawn('python',["./audio/volume.py"]);
  process.stdout.on('data', volume => {
    callback(volume);
  });
}

module.exports = routes;

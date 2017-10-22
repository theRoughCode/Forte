export function getVolume(fileName, callback) {
  var spawn = require("child_process").spawn;
  var process = spawn('python',["./audio/volume.py"]);
  process.stdout.on('data', volume => {
    callback(volume);
  });
}

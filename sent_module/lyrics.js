const Lyricist = require('lyricist/node6');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const lyricist = new Lyricist('wM_oIGV6lsW68L0ON6_YZ0usmrIvTh_NNruxfT2-MA45Rws5UDv3wiH-rOgjbflT');
var tone_analyzer = new ToneAnalyzerV3({
  username: '706e56ea-4218-4ab8-8bf9-2dfa4889d722',
  password: 'qXb6nCPLjUj5',
  version_date: '2016-05-19'
});

lyricist.song('Love Story', { fetchLyrics: true }).then(function(song) {
  var params = {
    // Get the text from the JSON file.
    text: song.lyrics,
    tones: 'emotion'
  }
  tone_analyzer.tone(params, function(error, response) {
    if (error)
      console.log('error:', error);
    else
      console.log(JSON.stringify(response, null, 2));
    }
  )
})

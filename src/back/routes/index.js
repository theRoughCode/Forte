const routes = require('express').Router();

routes.post('/blob', function(req, res) {
  console.log('req.body', req.body);
  res.send(req.body);
});

routes.get('/', (req, res) => {
  console.log('title');
  res.send('hello');
});

module.exports = routes;

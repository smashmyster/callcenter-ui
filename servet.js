const express = require('express');
const http = require('http');

const path = require('path');
// var compression = require('compression');

const app = express();
const server = http.createServer(app);

app.use(function (req, res, next) {
  res.header('Cache-Control', 'public, max-age=31536000');
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.get('*.js', function (req, res, next) {
  res.setHeader('Content-Type', 'text/javascript');
  // req.url = req.url + '.gz';
  // res.set('Content-Encoding', 'gzip');
  next();
});

app.get('index.html', function (req, res, next) {
  res.header('Cache-Control', 'no-cache');
  next();
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/app', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'build', 'app', 'index.html'));
});
app.get('/app/*', function (req, res) {
  let route = req.params['0'];
  route = route.indexOf('.html') > -1 ? route : `${route}.html`;
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'build', 'app', route));
});
// send all requests to index.html so browserHistory in React Router works
app.get('*', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 8005;

/* Start server */
server.listen(PORT, function () {
  console.log('Production Express server running at localhost:' + PORT);
});

module.exports = app;
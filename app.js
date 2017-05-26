let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let { serverPort: port } = require('./config');

let routes = require('./routes');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(errors.notFound));

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({errors: [err]});
});

var server = app.listen(port, () => {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;

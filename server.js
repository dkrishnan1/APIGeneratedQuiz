var express = require('express');
var bodyParser= require('body-parser');
// require path so that we can use path stuff like path.join
var path = require('path');
// instantiate the app
var app = express();
// set up a static file server that points to the "client" directory

app.use(bodyParser.json());
require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);
app.use(express.static(path.join(__dirname, '/client/static')));

app.listen(8000, function() {
  console.log('cool stuff on: 8000');
});
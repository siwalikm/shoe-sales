require('dotenv').config();
var express = require('express');
var app = express();
var twit = require('twit');
app.set('port', (process.env.PORT || 5000));

var Twitter = new twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));

app.get('/tweets', function (req, res) {
  let count, query;
  if (req.query.count) {
    count = req.query.count;
  } else count = 5;

  if (req.query.q) {
    query = req.query.q;
  } else query = '@siwalik';


  Twitter.get('search/tweets', {
    q: `${query}`,
    count: `${count}`
  }, function (err, data, response) {
    res.send(data);
  });
});


app.listen(app.get('port'), function () {
  console.log('Node app is running at http://localhost:' + app.get('port')); // eslint-disable-line
});
var mosca = require('mosca');
var express = require('express');
var app = express();

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {
  port: 1883,
  backend: ascoltatore
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

app.get('/:command', function (req, res) {

  var command = req.params.command;
 
  var message = {
    topic: 'inTopic',
    payload: command,
    qos: 0,
    retain: false
  };

  if(req.url === '/favicon.ico') {
    console.log('Favicon was requested');
  }
  else {
    server.publish(message, function() {
      console.log('Message sent');

      server.once('published', function(packet, client) {
        console.log('Published', packet.payload.toString('utf8'));
        res.json(JSON.parse(packet.payload.toString('utf8')));
      });
    });
  }
  
});

app.get('/:command/:pin/:state', function (req, res) {

  // Get parameters
  var command = req.params.command;
  var pin = req.params.pin;
  var state = req.params.state;
 
  // Message
  var message = {
    topic: 'inTopic',
    payload: command + '/' + pin + '/' + state,
    qos: 0,
    retain: false
  };

  if(req.url === '/favicon.ico') {
    console.log('Favicon was requested');
  }
  else {
    server.publish(message, function() {
      console.log('Message sent');

      server.once('published', function(packet, client) {
        console.log('Published', packet.payload.toString('utf8'));
        res.json(JSON.parse(packet.payload.toString('utf8')));
      });
    });
  }
  
});


server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}

var http_server = app.listen(3000, function () {

  console.log('Express server is up and running');

});

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const express = require('express');
const r = require('request');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 
app.get('/', function (req, res) {
  
  const twiml = new VoiceResponse;
  
  const gather = twiml.gather({
    action: '/thanks',
    method: 'POST',
    input: 'speech',
    language: 'en-US',
    speechTimeout: 4,
    speechModel: 'phone_call',

  });

  gather.say('Tell me your deepest desires');
  
  // content type required by twilio
  res.set('Content-Type', 'text/xml');
  res.end(twiml.toString());
});


app.post('/thanks', function (req, res) {
  
  const postUrl = 'https://asr-test.free.beeceptor.com/result';
  
  const response = new VoiceResponse;

  r.post({
    uri: postUrl,
    body: req.body,
    json: true
  });

  response.say('Thanks for your input!');

  res.set('Content-Type', 'text/xml');
  res.end(response.toString());
});


// echo test
app.post('/echo', function (req, res) {

  console.log('request:', req.body);

  res.set('Content-Type', 'application/json');
  res.status(200);
  res.send(req.body);

});



app.listen(8080);


module.exports = {
  app
};
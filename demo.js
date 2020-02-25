
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const express = require('express');
const r = require('request');

const app = express();

 
app.get('/', function (req, res) {
  
  const twiml = new VoiceResponse;
  
  const gather = twiml.gather({
    action: 'https://asr-test.free.beeceptor.com/result',
    method: 'POST',
    input: 'speech',
    language: 'en-US',
    speechTimeout: 8,
    speechModel: 'phone_call',

  })

  gather.say('Tell me your deepest desires');
  
  // content type required by twilio
  res.set('Content-Type', 'text/xml');
  res.end(twiml.toString());
});


app.use(express.urlencoded());


app.get('/thanks', function (req, res) {
  
  const postUrl = 'https://asr-test.free.beeceptor.com/result';

  const response = new VoiceResponse;
  response.say('Thanks for your input!');

  //r.post({
  //  uri: postUrl,
     
  //})

  res.set('Content-Type', 'text/xml');
  res.end(response.toString());
})

app.listen(8080);

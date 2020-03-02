
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const express = require('express');
const _ = require('lodash');
const xmlFormat = require('xml-formatter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ASR config

const hints = 'Ich möchte meine Anschrift ändern, Anschrift ändern, Anschrift, Anschriftenänderung';

const keywords = [
  'anschrift ändern',
  'anschriftenänderung'
];

const voiceDefaults = {
  voice: 'Polly.Marlene',
  language: 'de-DE'
};


// babelforce IB number to forward to
const ibNumber = 'sip:442039051180@trunk.marleyspoon.babelforce.com'


// initial route to perform ASR and send result to /thanks 
app.get('/asr', function (req, res) {
  
  const twiml = new VoiceResponse;
  
  const gather = twiml.gather({
    action: '/thanks',
    method: 'POST',
    input: 'speech',
    language: 'de-DE',
    hints: hints,
    speechModel: 'numbers_and_commands'

  });

  gather.say(voiceDefaults, 'Willkommen bei Eva Energie, wie kann ich Ihnen helfen?');
  
  // content type required by twilio
  res.set('Content-Type', 'text/xml');
  res.end(twiml.toString());
});



app.post('/thanks', function (req, res) {

  // json-stringify and base64-encode ASR result
  const speechRec = JSON.stringify(
    {
      transcript: req.body.SpeechResult,
      confidence: req.body.Confidence
    }
  );

  const b64String = Buffer.from(speechRec).toString('base64');
  

  // construct SIP URI with speech rec params  
  const head = 'X-Babelforce-Session-Set';

  //const fullUrl = `${baseUrl}?${pref}transcript=${speechRec.transcript}&${pref}keyword=${speechRec.keywordMatch}&${pref}confidence=${speechRec.confidence}`;
  const fullUrl = `${ibNumber}?${head}=${b64String}`;


  // twiML part
  const twim = new VoiceResponse;
  const sipForward = twim.dial();

  sipForward.sip(encodeURI(fullUrl));

  // debug
  //console.log(xmlFormat(twim.toString()));
  
  res.set('Content-Type', 'text/xml');
  res.end(twim.toString());
});





// echo test
app.post('/echo', function (req, res) {

  console.log('request:', req.body);

  res.set('Content-Type', 'application/json');
  res.status(200);
  res.send(req.body);

});


app.listen(8080);

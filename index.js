
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

  const speechRec = {
    transcript: req.body.SpeechResult,
    confidence: req.body.Confidence
  }

  // process transcript and look for matches
  const processedTranscript = _.split(_.toLower(speechRec.transcript), ', ');
  const matches = _.intersection(processedTranscript, keywords);

  if (matches.length > 0) {
    speechRec.keywordMatch = 'anschriftenaenderung'
  } else {
    speechRec.keywordMatch = 'no-match'
  }

  // construct SIP URI with speech rec params  
  const baseUrl = 'sip:442038290030@staging.dev.babelforce.com';
  const pref = 'x-babelforce-session-';

  const fullUrl = `${baseUrl}?${pref}transcript=${speechRec.transcript}&${pref}keyword=${speechRec.keywordMatch}&${pref}confidence=${speechRec.confidence}`;

  // twiML part
  const twim = new VoiceResponse;
  const sipForward = twim.dial();

  sipForward.sip(encodeURI(fullUrl));

  // debug
  console.log(xmlFormat(twim.toString()));
  
  res.set('Content-Type', 'text/xml');

  // set this when BABSER-3564 is done in order to send SIP to babelforce
  //res.end(twim.toString());
  res.end();
});



// configure this route in twilio to test BABSER-3564 

app.get('/siproute', function (req, res) {
  
  const sipResponse = new VoiceResponse;
  const dial = sipResponse.dial();

  dial.sip('sip:442038290030@staging.dev.babelforce.com?x-babelforce-session-foo=bar&x-babelforce-application-id=480b86569e3a4f8c8faa745486b4bc6d');

  res.set('Content-Type', 'text/xml');
  res.end(sipResponse.toString());

});



// echo test
app.post('/echo', function (req, res) {

  console.log('request:', req.body);

  res.set('Content-Type', 'application/json');
  res.status(200);
  res.send(req.body);

});


app.listen(8080);

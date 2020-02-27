
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const express = require('express');
const _ = require('lodash');

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

  const confidence = req.body.Confidence;
  const speechResult = req.body.SpeechResult;

  const speechRec = {
    confidenceScore: confidence,
    transcript: speechResult
  }

  const proc = x => _.split(_.toLower(x), ', ');
  
  const hintsProcessed = proc(hints);
  const speechResultProcessed = proc(speechResult);

  const matches = _.intersection(_.intersection(hintsProcessed, speechResultProcessed), keywords);

  if (matches.length > 0) {
    speechRec.keywordMatch = 'anschriftenaenderung'
  } else {
    speechRec.keywordMatch = 'no-match'
  }

  // speecRec is the object to use in the next step
  // TODO concatenate query string for SIP request param:
  // - x-babelforce-session-keyword --> `${speechRec.keywordMatch}`
  // - x-babelforce-session-transcript --> url-stringify `${speechRec.transcript}`
  // - x-babelforce-session-confidence --> transform float to low, medium, high
  //   values, or string score out of 10?  
  console.log(speechRec);


  // confirmation message and end request
  const response = new VoiceResponse;
  response.say(voiceDefaults, 'Moment ich leite Sie gleich an einen Mitarbeiter, der Ihnen mit der Anschriftenänderung helfen kann, weiter');

  res.set('Content-Type', 'text/xml');
  res.end(response.toString());
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

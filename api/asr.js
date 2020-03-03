const VoiceResponse = require('twilio').twiml.VoiceResponse;

// ASR config
const lang = 'de-DE' 
const hints = 'Ich möchte meine Anschrift ändern, Anschrift ändern, Anschrift, Anschriftenänderung';
const voiceDefaults = {
  voice: 'Polly.Marlene',
  language: lang
};

module.exports = (req, res) => {
  
  const twiml = new VoiceResponse;
  
  const gather = twiml.gather({
    action: '/api/forward',
    actionOnEmptyResult: true,
    method: 'POST',
    input: 'speech',
    speechTimeout: 'auto',
    language: lang,
    hints: hints,
    speechModel: 'numbers_and_commands'

  });

  gather.say(voiceDefaults, 'Willkommen bei Eva Energie, wie kann ich Ihnen helfen?');
  
  res.setHeader('content-type', 'application/xml');
  res.setHeader('cache-control', 'max-age=0, s-maxage=86400');
  res.status(200).send(twiml.toString());
};
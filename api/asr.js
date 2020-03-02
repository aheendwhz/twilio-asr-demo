const VoiceResponse = require('twilio').twiml.VoiceResponse;

// ASR config

const hints = 'Ich möchte meine Anschrift ändern, Anschrift ändern, Anschrift, Anschriftenänderung';

const voiceDefaults = {
  voice: 'Polly.Marlene',
  language: 'de-DE'
};

module.exports = (req, res) => {
  
  const twiml = new VoiceResponse;
  
  const gather = twiml.gather({
    action: '/api/forward',
    method: 'GET',
    input: 'speech',
    language: 'de-DE',
    hints: hints,
    speechModel: 'numbers_and_commands'

  });

  gather.say(voiceDefaults, 'Willkommen bei Eva Energie, wie kann ich Ihnen helfen?');
  
  res.end(twiml.toString());

};
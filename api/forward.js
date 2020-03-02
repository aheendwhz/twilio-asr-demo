
const VoiceResponse = require('twilio').twiml.VoiceResponse;


// babelforce IB number to forward to
const ibNumber = 'sip:442039051180@trunk.marleyspoon.babelforce.com'


module.exports = (req, res) => {

  const { query } = req;

  // json-stringify and base64-encode ASR result
  const speechRec = JSON.stringify(
    {
      transcript: query.SpeechResult,
      confidence: query.Confidence
    }
  );

  // construct SIP URI with speech rec params
  const b64String = Buffer.from(speechRec).toString('base64');  
  const head = 'X-Babelforce-Session-Set';
  const fullUrl = `${ibNumber}?${head}=${b64String}`;

  // twiML part
  const twim = new VoiceResponse;
  const sipForward = twim.dial();

  sipForward.sip(encodeURI(fullUrl));

  res.end(twim.toString());
};




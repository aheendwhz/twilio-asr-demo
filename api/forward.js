const VoiceResponse = require('twilio').twiml.VoiceResponse;

// babelforce IB number to forward to
const ibNumber = 'sip:442039051180@trunk.marleyspoon.babelforce.com'

module.exports = (req, res) => {

  const { body } = req;

  // json-stringify and base64-encode ASR result
  const speechRec = JSON.stringify(
    {
      transcript: body.SpeechResult,
      confidence: body.Confidence
    }
  );

  const b64String = Buffer.from(speechRec).toString('base64');  

  // construct SIP URI with speech rec params
  const head = 'X-Babelforce-Session-Set';
  const fullUrl = `${ibNumber}?${head}=${b64String}`;

  // twiML part
  const twiml = new VoiceResponse;
  const sipForward = twiml.dial();

  sipForward.sip(encodeURI(fullUrl));

  res.setHeader('content-type', 'application/xml');
  res.setHeader('cache-control', 'max-age=0, s-maxage=86400');
  res.status(200).send(twiml.toString());
};




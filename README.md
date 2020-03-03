# babelforce | twilio | ASR

Hacky little POC app to demonstrate how babelforce can integrate with ASR in a twiML app.

### Prerequisites

* `ngrok`
* `node.js` & `npm`
* twilio account with an inbound number
* team member of corresponding Zeit Now project
* `now` (globally installed)

### Install

```bash
# get `now` and configure
$ npm i -g now
$ now

# install
npm i
```


### Run development server

Start a live reload server, then `ngrok` to proxy it.

```bash
# shell 1
$ npm run serve

# shell 2
$ ngrok http 8080
```

Now, all the endpoint routes defined in `/api/` are available under their filepath both locally and at the ngrok proxy, e.g.

* `https://7d1f98db.ngrok.io/api/forward`
* `localhost:8080/api/echo`
* ...



---

### Point twilio at dev server

Ensure that the voice callback base URL for your twilio number is set to the `https://` variant of the proxy shown in the `ngrok` output (see images below). Configure the twilio part at https://www.twilio.com/console/phone-numbers/incoming. 

To test the ASR flow, the twilio entrypoint should be `/api/asr` (see screenshot), and the fallback webhook can point to the production version of the Now serverless function (deployed at `https://twilio-asr-demo.now.sh/api/asr`). 

![ngrok output](assets/ngrok.png "ngrok output")

![twilio number config](assets/twilio_config.png "twilio number config")

---

### Test

Call the inbound number (e.g. from a mobile phone).

Whilst the inbound number is routed to dev server, visit the ngrok frontend at `localhost:4040` to inspect the requests from twilio in detail.

If you stop the dev server locally, twilio will simply call the fallback webhook instead.

### Deploy

Deploy to prod directly from project root directory:

```bash
$ now --prod
```

Any pushes to this project's `master` will also trigger a deployment.

---

## Todo

- [x] **BUG**: first call to `/api/asr` is working, but currently request params sent by twilio to `/api/forward` are not being parsed by the function
- [x] test whole flow by enabling `res.end(twim.toString());` at end of `/thanks` route
- [x] automate deployment to GCP function or AWS lambda (https://babelforce.atlassian.net/browse/BABSER-3566) *actually went with Zeit Now*
- [x] tweak timeout and other settings to improve speech capture experience
- [x] enable flexible configuration of hints and input/speech language through env variables 
- [x] convert to twilio Functions



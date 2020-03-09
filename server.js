const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const {
  stringify
} = require('querystring');
const app = express();

app.use(express.json());

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'));

app.post('/subscribe', async (req, res) => {
  if (!req.body.captcha)
    return res.json({
      success: false,
      msg: 'Please select captcha'
    });

  const secretKey = '6LdWQ9EUAAAAAKvnkzruHNin9wZZW3CmX4_CG0V7';
  const query = stringify({
    secret: secretKey,
    response: req.body.captcha,
    remoteip: req.connection.remoteAddress
  });
  const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

  const body = await fetch(verifyURL).then(res => res.json());

  if (body.success !== undefined && !body.success)
    return res.json({
      success: false,
      msg: 'Failed captcha verification'
    });

  return res.json({
    success: true,
    msg: 'Captcha passed'
  });
});

app.get('/form', (req, res) => {
  res.redirect('https://61aa7211.ngrok.io')
});

app.listen(3000, () => console.log('Server started on port 3000'));
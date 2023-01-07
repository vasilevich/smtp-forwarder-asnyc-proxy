# smtp-forwarder-asnyc-proxy [![npm version](https://badge.fury.io/js/smtp-forwarder-asnyc-proxy.svg)](https://www.npmjs.com/package/smtp-forwarder-asnyc-proxy)

SMTP async forwarder that acts as a proxy for slow SMTP servers. It receives the subject, text, html, and credentials, and forwards them as-is to the destination SMTP server using nodemailer.

## Installation

To install `smtp-forwarder-asnyc-proxy`, run the following command:

```bash
npm install smtp-forwarder-asnyc-proxy   
```

```bash
yarn add smtp-forwarder-asnyc-proxy
```

## Configuration

To set the source and destination SMTP servers,
you will need to modify the config/production.json or config/development.json
(in accordance with the [config](https://www.npmjs.com/package/config) npmjs module).

## Usage after setting the config

should work anywhere where nodejs is supported(cross platform):

```bash
npm run start
```

## Usage inside your own code commonjs

```javascript
const createProxySmtpServer = require('smtp-forwarder-asnyc-proxy');
const config = {
  "source": [{
    "host": "127.0.0.1",
    "port": 25
  }],
  "destination": [{
    "host": "127.0.0.1",
    "port": 587,
    "secure": false
  }]
};
createProxySmtpServer(config);
```   
## Usage inside your own code ES
```javascript module
import {createProxySmtpServer} from 'smtp-forwarder-asnyc-proxy';
const config = {
  "source": [{
    "host": "127.0.0.1",
    "port": 25
  }],
  "destination": [{
    "host": "127.0.0.1",
    "port": 587,
    "secure": false
  }]
};
createProxySmtpServer(config);
```
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

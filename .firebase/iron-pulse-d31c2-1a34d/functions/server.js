const { onRequest } = require('firebase-functions/v2/https');
  const server = import('firebase-frameworks');
  exports.ssrironpulsed31c21a34d = onRequest({}, (req, res) => server.then(it => it.handle(req, res)));
  
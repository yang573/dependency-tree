const express = require('express');
const router = express.Router();

router.get('/traverse-repo', function(req,res) {
  console.log('get /traverse-repo received');
  console.log(req.query.url);
  res.send({ status: 200, message: 'Api reached' });
});

module.exports = router;

// module.exports = function(app) {
//
// };

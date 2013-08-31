'use strict';

var request =  require('request')
  , log     =  require('valuepack-core/util/log');

function stream(opts) {
  var req = request.get(opts);
  req.on('error', log.error.bind(log, 'mine-npm/fetch'));
  return req;
}

/** * 
  * Fetches all resources and calls back with results if callback is given, otherwise streams them.
  * @function 
  * @param uri {String} resource uri 
  * @param cb {Function} callback (optional)
  * @return {Stream} if no callback is given
  */
module.exports = function (uri, cb) {
  var opts = {
      uri  :  uri
    , json :  true
  };

  if (!cb) return stream(opts);

  request(opts, function (err, res, body) {
    if (err) return cb(err);  
    if (/^[45]\d\d/.test(res.statusCode)) return cb(body);
    cb(null, { headers: res.headers, statusCode: res.statusCode, body: body });
  });
};

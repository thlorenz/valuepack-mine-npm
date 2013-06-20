'use strict';

var fetch = require('./fetch');

/** * 
  * Fetches all npm packages and calls back with results if callback is given, otherwise streams them.
  * @function 
  * @param cb {Function} callback (optional)
  * @return {Stream} if no callback is given
  */
module.exports = fetch.bind(null, 'https://registry.npmjs.org/-/all/');

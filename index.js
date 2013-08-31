'use strict';

var leveldb          =  require('valuepack-core/mine/leveldb')
  , log              =  require('valuepack-core/util/log')
  , storeUsers       =  require('./lib/store-npm-users')
  , storePackages    =  require('./lib/store-npm-packages')
  , fetchNpmPackages =  require('./lib/fetch-all-npm-packages')
  , fetchNpmUsers    =  require('./lib/fetch-all-npm-users');

function fetchNstoreUsers (db, cb) {
  log.info('mine-npm', 'fetching npm users ...');
  
  fetchNpmUsers(function (err, res) {
    if (err) return cb(err);  

    var users = res.body;
    log.info('mine-npm', 'storing npm users ...');
    storeUsers(db, users, cb); 
  });
}

function fetchNstorePackages (db, cb) {
  log.info('mine-npm', 'fetching npm packages ...');

  fetchNpmPackages(function (err, res) {
    if (err) return cb(err);  

    var packages = res.body;
    log.info('mine-npm', 'storing npm packages ...');
    storePackages(db, packages, cb); 
  });
}

/**
 * Fetches all npm users and npm package and stores them in the given db.
 * 
 * @name exports
 * @function
 * @param db {LevelDB} expected have sublevel mixed in which is done via the leveldb.open() call
 * @param cb {Function} called back with an error or a sublevel response
 */
module.exports = exports = function store (db, cb) {
  fetchNstoreUsers(db, function (err, res /* contains sublevels npmUsers and byGithub into which data was stored */) {
    if (err) return cb(err);
    fetchNstorePackages(db, function (err, res /* contains sublevels npmPackages, byOwner and byKeyword into which data was stored */) {
      cb(err, res);  
    });
  });
};

exports.storeNpmPackages =  storePackages;
exports.storeNpmUsers    =  storeUsers;
exports.fetchNpmPackages =  fetchNpmPackages ;
exports.fetchNpmUsers    =  fetchNpmUsers;

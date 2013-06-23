'use strict';

var leveldb          =  require('valuepack-core/mine/leveldb')
  , storeUsers       =  require('./lib/store-npm-users')
  , storePackages    =  require('./lib/store-npm-packages')
  , fetchNpmPackages =  require('./lib/fetch-all-npm-packages')
  , fetchNpmUsers    =  require('./lib/fetch-all-npm-users');

function fetchNstoreUsers (db, cb) {
  console.error('fetching npm users ...');
  
  fetchNpmUsers(function (err, res) {
    if (err) return cb(err);  

    var users = res.body;
    console.error('storing npm users ...');
    storeUsers(db, users, cb); 
  });
}

function fetchNstorePackages (db, cb) {
  console.error('fetching npm packages ...');

  fetchNpmPackages(function (err, res) {
    if (err) return cb(err);  

    var packages = res.body;
    console.error('storing npm packages ...');
    storePackages(db, packages, cb); 
  });
}

module.exports = exports = function store (cb) {
  leveldb.open(function (err, db) {
    if (err) { 
      leveldb.close(err, db);
      return cb(err);
    }

    fetchNstoreUsers(db, function (err, res) {
      if (err) { 
        leveldb.close(err, db);
        return cb(err);
      }

      fetchNstorePackages(db, function (err, res) {
        if (err) return leveldb.close(err, db);
        leveldb.close(err, db, cb);
      });
    });
  });
};

exports.storeNpmPackages =  storePackages;
exports.storeNpmUsers    =  storeUsers;
exports.fetchNpmPackages =  fetchNpmPackages ;
exports.fetchNpmUsers    =  fetchNpmUsers;

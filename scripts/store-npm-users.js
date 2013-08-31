#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var path       =  require('path')
  , fs         =  require('fs')
  , leveldb    =  require('valuepack-core/mine/leveldb')
  , dump       =  require('level-dump')
  , store      =  require('../lib/store-npm-users')
  , npm        =  require('valuepack-core/mine/namespaces').npm
  , existsSync =  fs.existsSync || path.existsSync
  ;

function retrieveOnly(db, cb) {
  var users    =  db.sublevel(npm.users, { valueEncoding: 'json' })
    , byGithub =  db.sublevel(npm.byGithub, { valueEncoding: 'utf8' });

  var sub = users
    , what = 'entries'
    , argv = process.argv;

  if (~argv.indexOf('--github')) sub = byGithub
  if (~argv.indexOf('--keys')) what = 'keys'
  if (~argv.indexOf('--values')) what = 'values'

  dump[what](sub, function(err) { cb(err, db) })
}

var storeNpmUsers = module.exports = function (db, cb) {
  var dataDir = process.env.VALUEPACK_DATA || path.join(__dirname, '..', 'data')
    , jsonPath = path.join(dataDir, 'npm-users.json')

  if (!existsSync(jsonPath)) 
    return console.error('Cannot find %s. Please make sure to run fetch-npm-users first', jsonPath);
    
  var json = fs.readFileSync(jsonPath, 'utf8')

  store(db, JSON.parse(json),  function (err, subs) {
    if (err) return cb(err, db);
    console.log('Stored all npm users at: ', leveldb.location);
    cb(null, db)
  })
}

if (module.parent) return;

if (!~process.argv.indexOf('--read'))
  leveldb.open(function (err, db) {
    if (err) return leveldb.close(err, db);
    storeNpmUsers(db, retrieveOnly.bind(null, db, leveldb.close))
  })
else 
  leveldb.open(function (err, db) {
    if (err) return leveldb.close(err, db);
    retrieveOnly(db, leveldb.close)
  })

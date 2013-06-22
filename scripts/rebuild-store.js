#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var leveldb       =  require('valuepack-core/mine/leveldb')
  , storeUsers    =  require('./store-npm-users')
  , storePackages =  require('./store-npm-packages')

function store() {
  leveldb.open(function (err, db) {
    if (err) return leveldb.close(err, db);

    storeUsers(db, function (err, db) {
      if (err) return leveldb.close(err, db);
      
      storePackages(db, function (err, db) {
        if (err) return leveldb.close(err, db);
        leveldb.close(err, db)
      })
    })
  })
}

if (~process.argv.indexOf('--fetch'))
  console.error('Fetching coming soon')

if (~process.argv.indexOf('--destroy')) {
  leveldb.destroy(function (err) {
    if (err) return console.error(err)
    console.log('destroyed db')
    store()
  })
} else {
  store();
}


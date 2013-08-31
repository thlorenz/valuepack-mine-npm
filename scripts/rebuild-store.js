#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var leveldb =  require('valuepack-core/mine/leveldb')
  , store   =  require('../')

if (~process.argv.indexOf('--destroy')) {
  leveldb.destroy(function (err) {
    if (err) return console.error(err)
    console.error('destroyed db')

    leveldb.open(function (err, db) {
      if (err) return leveldb.close(err, db);
      store(function (err) {
        leveldb.close(err, db);
      })
    })
  })
} else {
  leveldb.open(function (err, db) {
    if (err) return leveldb.close(err, db);
    store(function (err) {
      leveldb.close(err, db);
    })
  })
}


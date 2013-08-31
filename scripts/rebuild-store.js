#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var leveldb  =  require('valuepack-core/mine/leveldb')
  , log      =  require('valuepack-core/util/log')
  , sublevel =  require('level-sublevel')
  , store    =  require('../')

function storeInSublevel () {
  leveldb.open(function (err, db) {
    if (err) return leveldb.close(err, db);
    db = sublevel(db);
    store(db, function (err) {
      leveldb.close(err, db);
    })
  })
}

if (~process.argv.indexOf('--destroy')) {
  leveldb.destroy(function (err) {
    if (err) return log.error('mine-npm/rebuild-store', err)
    log.info('mine-npm/rebuild-store', 'destroyed db')
    storeInSublevel();
  })
} else {
  storeInSublevel();
}


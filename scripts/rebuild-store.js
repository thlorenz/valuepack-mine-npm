#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var leveldb =  require('valuepack-core/mine/leveldb')
  , store   =  require('..')

if (~process.argv.indexOf('--destroy')) {
  leveldb.destroy(function (err) {
    if (err) return console.error(err)
    console.error('destroyed db')

    store(function (err) {
      if (err) console.error(err);  
    });
  })
} else {
  store(function (err) {
    if (err) console.error(err);  
  });
}


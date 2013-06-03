#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var leveldb = require('valuepack-core/mine/leveldb')

leveldb.destroy(function (err) {
  if (err) return console.error(err); 
  console.log('destroyed', leveldb.location)
})

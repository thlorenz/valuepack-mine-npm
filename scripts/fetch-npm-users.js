#!/usr/bin/env node

'use strict';
/*jshint asi: true */


var path        =  require('path')
  , fs          =  require('fs')
  , log         =  require('valuepack-core/util/log')
  , usersStream =  require('../lib/fetch-all-npm-users')
  , dataDir     =  process.env.VALUEPACK_DATA || path.join(__dirname, '..', 'data')
  , jsonPath    =  path.join(dataDir, 'npm-users.json')

log.info('script/fetch-users', 'Storing fetched users data at: ', jsonPath);
usersStream().pipe(fs.createWriteStream(jsonPath, { encoding: 'utf8' }))

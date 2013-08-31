#!/usr/bin/env node

'use strict';
/*jshint asi: true */

var path           =  require('path')
  , fs             =  require('fs')
  , log            =  require('valuepack-core/util/log')
  , packagesStream =  require('../lib/fetch-all-npm-packages')
  , dataDir        =  process.env.VALUEPACK_DATA || path.join(__dirname, '..', 'data')
  , jsonPath       =  path.join(dataDir, 'npm-packages.json')

log.info('script/fetch-users', 'Storing fetched packages data at: ', jsonPath);
packagesStream().pipe(fs.createWriteStream(jsonPath, { encoding: 'utf8' }))

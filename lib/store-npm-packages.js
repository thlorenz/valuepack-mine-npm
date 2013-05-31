'use strict';
var npm = require('./namespaces').npm;

function getMaintainer(maintainers) {
  return maintainers && maintainers[0];
}

function getOwner(maintainer) {
  if (   maintainer 
      && maintainer.name
      && maintainer.name.length)
      return maintainer.name;

  return null;
}

function getEmail(maintainer, author) {
  if (   maintainer
      && maintainer.email
      && maintainer.email.length)
      return maintainer.email;

  return (author && author.email) || null;
}

function getRepoUrl(repo) {
  if (!repo) return null;
  if (!repo.url || !repo.url.length) return null;
  return repo.url;
}

// simplest and fastest solution for now 
// if we ever run into memory issues, use 'npm i JSONStream'
// it will be slower due to smaller batches, but have much smaller memory footprint
var get = module.exports = function (db, json, cb) {
  var npmPackages =  db.sublevel(npm.packages, { valueEncoding: 'json' })
    , byOwner     =  db.sublevel(npm.byOwner, { valueEncoding: 'utf8' })
    , byKeyword   =  db.sublevel(npm.byKeyword, { valueEncoding: 'utf8' });

  var packages;
  try {
    packages = JSON.parse(json);
  } catch(e) { cb(e); }

  var batch = Object.keys(packages).map(function (k) {
    var p          =  packages[k]
      , maintainer =  getMaintainer(p.maintainers)

      , info = {
          type  :  'put'
        , key   :  k
        , value :  {
            name        :  k
          , owner       :  getOwner(maintainer)           || null
          , email       :  getEmail(maintainer, p.author) || null
          , repoUrl     :  getRepoUrl(p.repository)       || null
          , versions    :  p.versions                     || null
          , keywords    :  p.keywords                     || null
          , description :  p.description                  || null
          }
      };
      
      return info;
  });
  

  npmPackages.pre(function (val, add) {
    add({ prefix :  byOwner
        , type   :  'put'
        , key    :  val.value.owner
        , value  :  val.key });

    val.value.keywords.forEach(function (keyword) {
      add({ prefix :  byKeyword
          , type   :  'put'
          , key    :  keyword
          , value  :  val.key });
    });
  });
  
  npmPackages.batch(
      batch
    , function (err) { 
        cb(err, { npmPackages: npmPackages, byOwner: byOwner, byKeyword: byKeyword }); 
    }); 
};

'use strict';
/*jshint asi: true */

var path       =  require('path')
  , fs         =  require('fs')
  , level      =  require('level')
  , sublevel   =  require('level-sublevel')
  , dump       =  require('../lib/dump')
  , store      =  require('../lib/store-npm-users')
  , npm        =  require('../lib/namespaces').npm
  , dblocation =  path.join(__dirname, '..', 'store/valuepack.db')
  ;

function retrieveOnly(db, cb) {
  db = sublevel(db);

  var packages  =  db.sublevel(npm.packages, { valueEncoding: 'json' })
    , byOwner   =  db.sublevel(npm.byOwner, { valueEncoding: 'utf8' })
    , byKeyword =  db.sublevel(npm.byKeyword, { valueEncoding: 'utf8' });

  console.log('retrieving: ');
  
  dump.all(packages, function(err) { cb(err, db) })
}

// TODO: request this file from couch every time
// https://registry.npmjs.org/-/users/
var json = fs.readFileSync(path.join(__dirname, '..', 'data', 'all-9000-10000.json'), 'utf8')

level.destroy(dblocation, function () {
  level(dblocation, { valueEncoding: 'json' }, function (err, db) {
    if (err) return done(err);
    db = sublevel(db);
    get(db, json, retrieveOnly.bind(null, db, done))
  })
})

function done(err, db) {
  if (err) { 
    console.trace();
    console.error(err);
  }
  console.log('closing db');
  db && db.close()
}
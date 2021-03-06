'use strict';
var npm = require('valuepack-core/mine/namespaces').npm;

function githubName(gh) {
  // some users give full url instead of just github name - fix that here
  return (/\//).test(gh) ? gh.split('/').pop() : gh;
}

// simplest and fastest solution for now 
// if we ever run into memory issues, use 'npm i JSONStream'
// it will be slower due to smaller batches, but have much smaller memory footprint
module.exports = function (db, users, cb) {
  var npmUsers =  db.sublevel(npm.users, { valueEncoding: 'json' })
    , byGithub =  db.sublevel(npm.byGithub, { valueEncoding: 'utf8' });

  var batch = Object.keys(users).map(function (k) {
    var u = users[k]
      , info = {
          type  :  'put'
        , key   :  k
        , value :  {
            name     :  u.name
          , email    :  u.email               || null
          , github   :  githubName(u.github)  || null
          , twitter  :  u.twitter             || null
          , fullname :  u.fullname            || null
          }
      };
      return info;
  });

  npmUsers.pre(function (val, add) {
    var github = val.value.github;
    if (github) {
      add({ prefix :  byGithub
          , type   :  'put'
          , key    :  github
          , value  :  val.key });
    }
  });
  
  npmUsers.batch(
      batch
    , function (err) { 
        cb(err, { sublevels: { npmUsers: npmUsers, byGithub: byGithub } }); 
    }); 
};

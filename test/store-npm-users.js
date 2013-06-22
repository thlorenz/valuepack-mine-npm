'use strict';
/*jshint asi: true */

var test     =  require('tap').test
  , fs       =  require('fs')
  , dump     =  require('level-dump')
  , level    =  require('level-test')({ mem: true })
  , sublevel =  require('level-sublevel')
  , store    =  require('../lib/store-npm-users')

// contains 5 different authors
var json = fs.readFileSync(__dirname + '/fixtures/npm-users-sample.json', 'utf8')

test('\nwhen storing 5 different authors', function (t) {
  var db = sublevel(level(null, { valueEncoding: 'json' }))
  
  store(db, JSON.parse(json), function (err, res) {
    t.plan(2)

    if (err) console.error(err);
    t.notOk(err, 'no error')
    
    t.test('\n# stores all users', function (t) {
      var users = []
      dump(
          res.sublevels.npmUsers
        , [].push.bind(users)
        , function (err) { 
            if (err) console.error(err)

            t.equal(users.length, 5, 'stores 5 users')

            var fst = users[0]
              , trd = users[2]

            t.deepEqual(
                fst
              , { key: 'galuszkak',
                  value:
                  { name: 'galuszkak',
                    email: 'galuszkak@gmail.com',
                    github: null,
                    twitter: null,
                    fullname: null } }
              , 'stores first user'
            )

            t.deepEqual(
                trd
              , { key: 'gambo',
                  value:
                  { name: 'gambo',
                    email: 'spam@nerdyglass.es',
                    github: 'nerdyglasses',
                    twitter: 'nerdyglass_es',
                    fullname: 'Christian Gambardella' } }
              , 'stores third user including fullname, email, github and twitter info'
            )
            
            t.end()
          }
      )

    })
  })
})

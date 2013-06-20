'use strict';
/*jshint asi: true */

var test     =  require('tap').test
  , fs       =  require('fs')
  , dump     =  require('level-dump')
  , level    =  require('level-test')({ mem: true })
  , sublevel =  require('level-sublevel')
  , store    =  require('../lib/store-npm-packages')

// contains 6 packages by different authors
var json = fs.readFileSync(__dirname + '/fixtures/npm-packages-sample.json', 'utf8')

test('\nwhen storing 6 packages by different authors', function (t) {
  var db = sublevel(level(null, { valueEncoding: 'json' }))
  
  store(db, JSON.parse(json), function (err, res) {
    t.plan(2)


    t.notOk(err, 'no error')
    
    t.test('\n# stores packages correctly', function (t) {
      var packages = []
      dump(
          res.sublevels.npmPackages
        , [].push.bind(packages)
        , function (err) { 
            if (err) console.error(err)

            t.equal(packages.length, 6, 'stores 6 packages')

            var fst = packages[0]
              , trd = packages[2]

            t.deepEqual(
                fst
              , { key: 'aemitter',
                  value:
                  { name: 'aemitter',
                    owner: 'mattmueller',
                    email: 'mattmuelle@gmail.com',
                    repoUrl: null,
                    versions: { '0.0.1': 'latest' },
                    keywords: [],
                    description: 'async emitter' } }
              , 'stores all data of first package'
            )
            t.deepEqual(
                trd
              , { key: 'aero-client',
                  value:
                  { name: 'aero-client',
                    owner: 'vesln',
                    email: 'hi@vesln.com',
                    repoUrl: 'https://github.com/aeroio/node-client',
                    versions: { '0.0.1': 'latest' },
                    keywords: [ 'aero.io', 'aero' ],
                    description: 'API client for aero.io' } }
              , 'stores all data of third package including repo url and keywords'
            )
            
            t.end()
          }
      )

    })
  })
})

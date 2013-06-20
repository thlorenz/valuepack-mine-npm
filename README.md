# valuepack-mine-npm [![build status](https://secure.travis-ci.org/thlorenz/valuepack-mine-npm.png)](http://travis-ci.org/thlorenz/valuepack-mine-npm)

Supports [valuepack](https://github.com/thlorenz/valuepack), the community driven rating system for nodejs modules on
npm in order to help in selecting the right one.

Read more [about its goals](https://github.com/thlorenz/valuepack/blob/master/goals.md).

## functions

The entire public API is exposed via the index file:

```js
exports.storeNpmPackages  =  require('./lib/store-npm-packages');
exports.storeNpmUsers     =  require('./lib/store-npm-users');
exports.streamNpmPackages =  require('./lib/stream-npm-packages');
exports.streamNpmUsers    =  require('./lib/stream-npm-users');
```

## scripts

You can play with scripts inside `./scripts`.

### environment variables

The following environment variables are considered by the scripts:

- `VALUEPACK_DATA` the directory in which json data fetched from the npm registry is stored (defaults to
  `valuepack-mine-npm/data`)
- `VALUEPACK_MINE_DB` the path at which the leveldb data is stored (defaults to `valuepack-mine-npm/store/valuepack-mine.db`)

Make sure to include them every time you execute a script or add the following to your `.bashrc` (example):

```sh
export VALUEPACK_DATA=~/.valuepack/data
export VALUEPACK_MINE_DB=~/.valuepack/valuepack-mine.db
```
### fetching data initializing the data store

An init script is provided that fetches all needed data from npm and stores it as json and in a leveldb database at
`~/.valuepack`.

Do one of the following:

`npm run init`
or
`cd scripts && ./init.sh`

### fetch npm data scripts

```sh
# fetch users
./fetch-npm-users.js

# fetch packages
./fetch-npm-packages.js
```

### rebuild script

In order to store all data in leveldb, please run:

    ./rebuild-store.js

**Note:** rebuilding the database from local json files takes about 2mins on a MacBookAir.

### store scripts

All `store-*` scripts take parameters. 

- `--read` read out values of the store instead of adding them
- `--keys` pull out and print keys only
- `--values` pull out and print values only

Therfore if you want to query data you should always pass the `--read` flag.

#### store-npm-packages specific parameters

- `--owners` list owner indexes instead of packages
- `--keyword` list keyword indexes instead of packages

#### store-npm-users specific parameters

- `--github` list github login indexes instead of users

### examples

```sh
# get package keyword count
./store-npm-packages.js --read --keyword --keys | wc -l

# get package count
./store-npm-packages.js --read --keys | wc -l

# query how many users did provide a github account
./store-npm-users.js --read --github --keys | wc -l

# query how many packages dominictarr published
./store-npm-packages.js --read --owner --keys | grep dominictarr | wc -l
```

# fields

fields from the npm registry db that will be useful to store

- fields to be indexed in **bold**
- fields we may not need in *italic*

## npm users

count: ~8300

### Get all users

    curl -k https://registry.npmjs.org/-/users/

### Minimum
  
  - **name**
  - email
  - *date*

### Extra

  - **github** (should just be name, but some people put full url, extract name then)
  - twitter
  - fullname (may not need)

In case no github info was given, try to resolve gihub user name from npm user name, i.e. ping github with same name and
if the account exists, assume that it is the right one. This will work in 99% of the cases.
Later we can look thru user's repos and if one links github we can check against what we guessed
  
## npm packages

count: ~30600

### Get all packages

    curl -k https://registry.npmjs.org/-/all/

### Minimum

  - **name** (the key)
  - maintainers (first one) **name**
  - repository (type, url)
  - versions
  - *dist-tags*
  - *time (modified)*

### Extra

  - **keywords**
  - description (81 don't have one)
  - keywords
  - *author (name, email)*

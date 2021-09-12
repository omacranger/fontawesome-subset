# Upgrading Versions

## 2.0 to 3.0
3.0 has updated the default export to be a little more friendly for modern tooling. Anywhere you were previously using
`const fontawesomeSubset = require('fontawesome-subset');` may need to be updated to the newer format, 
`import { fontawesomeSubset } from "fontawesome-subset";`. 

## 1.x to 2.0
Version 2.0 of fontawesome-subset removes the required dependency for `@fortawesome/fontawesome-free`. 

### Pro Users 
For Pro users, this release should be backwards compatible since we're only removing the required dependency for the free version. 

### Free Users
For Free users, this means you'll have to manually specify / save the dependency, as noted in the updated readme.
```sh
npm install --save-dev @fortawesome/fontawesome-free
```  
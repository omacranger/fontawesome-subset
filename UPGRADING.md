# Upgrading Versions

## 1.x to 2.0
Version 2.0 of fontawesome-subset removes the required dependency for `@fortawesome/fontawesome-free`. 

### Pro Users 
For Pro users, this release should be backwards compatible since we're only removing the required dependency for the free version. 

### Free Users
For Free users, this means you'll have to manually specify / save the dependency, as noted in the updated readme.
```sh
npm install --save-dev @fortawesome/fontawesome-free
```  
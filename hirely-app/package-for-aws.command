#!/bin/bash
cd $(dirname "$0")
cp server/config.js config.js.bak
cp server/config.production.js server/config.js
zip -r aws-package.zip .ebextensions .bowerrc bower.json client customLibs firebase.json gulp.config.js gulpfile.js npm-debug.log package.json server server.js
mv config.js.bak server/config.js

Hirely Backend and Web App
===================

This is a private repo, and is not to be shared to anyone without explicit permission by the leadership of Hirely Incorporated of Washington, DC.

This repo contains the source code for Hirely, Inc's MEAN + Mongoose ORM stack.

----------

Overview
-------------


We are using the following open-source tools and frameworks (not necessarily complete).

**Backend Webserver:**
- [Node.js](https://nodejs.org/en/) - Javascript Engine
- [Express.js](http://expressjs.com/en/index.html) - Node.js web-server framework
- [MongoDB](https://www.mongodb.com/) - NoSql db.  Used to store ONET data, and business data
- [Firebase JS Library](https://www.firebase.com/docs/web/quickstart.html) - library to comm with Firebase db web service
- [node geocoder](https://github.com/nchaulet/node-geocoder) - converts addresses to geo coords
- [Traitify Node](https://github.com/traitify/traitify-node) - Traitify library for nodejs

**3rd Party Services:**
- [Firebase](https://www.firebase.com/) - DB as a service. Stores all user info
- [Traitify](https://www.traitify.com/) - Personality Assessment as a service

**Frontend Web Application:**
Functional
- [AngularJS](https://angularjs.org/) - Javascript Web Application framework
- [AngelFire](https://www.firebase.com/docs/web/libraries/angular/) - Firebase library for AngularJS
- [Geofire](https://github.com/firebase/geofire-js) - Firebase library for querying based on location
- [Traitify JS Client](https://github.com/traitify/traitify-js-client) - Traitify library for generic javascript apps
- [Traitify JS Widgets](https://github.com/traitify/traitify-js-widgets) - Some javascript html widgets
UX
- [Twitter Bootstrap](http://getbootstrap.com/) - UX library
- [angular-ui](https://github.com/angular-ui) - Library of ui features
- [Flexslider.js](http://flexslider.woothemes.com/) - Javascript slider
- [pixeden-stroke-7-icon](https://github.com/olimsaidov/pixeden-stroke-7-icon) - IOS style icon set
- [Font awesome](https://fortawesome.github.io/Font-Awesome/) - custom font(s)
- Google font "Open Sans" - custom font
- Google maps


----------

Setup MongoDB Database
-------------

At minimum, ONET data needs to be installed to your MongoDB.  This procedure has not been confirmed yet.  Need to figure out how to import ONET to mongo.

> brew install mongodb
> cd seeddata
> curl http://www.onetcenter.org/dl_files/database/db_20_1_text.zip -o db_20_1_text
> cd db_20_1_text
> find . -name *.txt -exec mongoimport --db hirely --drop --file {} \;


----------

Running the server locally
-------------

> brew update; brew install npm
> npm install -g bower gulp
> git clone git@github.com:ryantroll/Hirely-MVP.git
> cd Hirely-MVP
> npm install
> bower install
> gulp 2>&1 >> ../gulp.log &
> cd server
> node server.js 2>&1 >> ../server.log &
> open http://localhost:7200

What's going on?
 1. Install node.js.  For mac, we recommend homebrew.
 2. Install bower and gulp globally
 3. Clone this repo and cd to it
 4. Install dependencies
 5. Run the css compiler 'gulp' as daemon
 5. Run server as daemon
 6. Open http://localhost:7200 in a browser



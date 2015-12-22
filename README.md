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

At minimum, ONET data needs to be installed to your MongoDB.  This procedure is a work in progress.

```
brew update; brew install mongodb
sudo mkdir -p /data/db
mongod 2>&1 >> mongodb.log &
cd seeddata
curl -L https://www.dropbox.com/s/sr32h1spoyp8dy2/WeightedValueFiles1.zip?dl=0 -o WeightedValueFiles1.zip
unzip WeightedValueFiles1.zip
cd WeightedValueFiles
sed -i.bak s/Element.Component/ElementComponent/g *
rm *.bak
find . -name "*.csv" -exec mongoimport --db hirely --headerline --type=csv --drop --file {} \;
```

----------

Running the server locally (db must already be setup and running)
-------------

```
brew update; brew install npm
sudo mkdir -p /data/db
npm install -g bower gulp
git clone git@github.com:ryantroll/Hirely-MVP.git
cd Hirely-MVP
npm install
bower install
gulp 2>&1 >../gulp.log &
cd server
node server.js 2>&1 >../server.log &
open http://localhost:7200
```

What's going on?
 1. Install node.js.  For mac, we recommend homebrew.
 2. Install bower and gulp globally
 3. Clone this repo and cd to it
 4. Install dependencies
 5. Run the css compiler 'gulp' as daemon
 5. Run server as daemon
 6. Open http://localhost:7200 in a browser



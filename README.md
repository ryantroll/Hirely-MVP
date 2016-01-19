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

Install dependencies
-------------

```
brew update; brew install npm
sudo mkdir -p /data/db
npm install -g bower gulp
git clone git@github.com:ryantroll/Hirely-MVP.git
cd Hirely-MVP
npm install
bower install
```

What's going on?
 1. Install node.js.  For mac, we recommend homebrew.
 2. Install bower and gulp globally
 3. Clone this repo and cd to it
 4. Install dependencies


----------

Seed Users and Businesses to MongoDB
-------------

Follow steps to install dependencies and run MongoDB first

```
cd Hirely-MVP/hirely-app/server
node tests/test.*.model.js
```


----------

Running the server locally
-------------

Follow steps to run MongoDB first

```
cd Hirely-MVP
npm install
bower install
gulp 2>&1 >../gulp.log &
cd server
node server.js 2>&1 >../server.log &
open http://localhost:7200
```

What's going on?
 1. Run the css compiler 'gulp' as daemon
 2. Run server as daemon
 3. Open http://localhost:7200 in a browser


----------

Users and Authentication
-------------

Logged in user presented in "AuthService.currentUser" and "AuthService.currentUserID" object when undefined user considered loged out.
Attention needed when updating current user profile in DB AuthService need to be notifed with updateCurrentUser method to make sure logged in user in fron-end is not out of sync.
The above objects used to notify controllars and modify the views accordingly only
the true securiyt check and login session managment is handled by Firebase SDK so far.
AuthService as angular service singelton object will provide the currentUser and currentUserID properties
Header controler "app/layout/headerCtrl.js" has the code that register $rootScope listener for ShowRegister, ShowLogin, ShowForgotPassword events, the above event will be emited from differnet places to show the right form

Code Location:
User Registration in www/app/account/registerCtrl.js
User Login in www/app/account/loginCtrl.js
User checked for login/logout status in www/app/layout/masterCtrl.js

Models:
1. User in www/app/core/services/models/user.js
2. Education in www/app/core/services/models/user.js
3. Experience in www/app/core/services/models/user.js
When user model first saved to DB eduction, education, experience and all other properties that don't have value are saved as "False"

Services:
Users authenticatin and data saving is handled by below services
1. UserService in www/app/core/services/service.user.js this work as abstract auth service to isolate firebase authenticaion for easy migration
2. AuthService in www/app/core/services/service.auth.js used for dealing with user data saving and retriving for DB

Events:
1. "UserLoggedIn": broadcast by $rootScope to notify child scope about logged, this event will send a new user object as variable.
2. "UserLoggedOut": broadcast by $rootScope to notify children scope about user loged out, no variable sent with it.
3. "UserDataChange": broadcast by $rootScope to notify children scope about data change in current loggedin user. Used when logged in user update his profile.

Note:
AuthService is doing the job so far but it's not coded as it should be


----------

# API
-------------

## Users API:

User fields in database identified as basic and extended the default api call will get the basic fields, extended field can retrived by add ?extnded query parameter to URL

End points
GET /api/v1/users/:id will return the user basic info
GET /api/v1/users/:id/external will return the user basic info by sending external ID e.g. user ID in firebase
GET /api/v1/users/:id?extended will return the user extended info only execluding the basic ifn

POST /api/v1/users/ add new users and will return user object with Basic info only

## Traitify API:

Traifiy API desinged to deal with traifiy API from local server mainly to protect the secret key of traitify API from being exposed in front-end

End points
GET     /api/v1/traitify/ will return the
GET     /api/v1/traitify/assessment-id will issue a request to Traitify API from local server to generate a new assessment test and return the assessment ID form Traifiy API in response
GET     /api/v1/traitify/test will return in the response a static and full assessment test object from local server, very usefull to avoid answering the 56 slide while testing
POST    /api/v1/traitify/?userId={userId}&assessmentid={assessmentId} will save a new personality assessment summary to the user object in database and extract the meta data from the assessment

**NOTE:** A summary of personality assessment is saved as part of user object and meta data of assessment is extracted form the assessment data and saved in seperate collection in database, important to note that the assessemnt saving is done by starting a post request to traitify endpint of API not user endpoint due to the extrat proccessing required to extract meta data




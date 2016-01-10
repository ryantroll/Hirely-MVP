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
Hirely API use 2 different type of URL components, each one of these components in URL will decide (1) what data collection or data object will be returned (2) what data will be included in returned in response and how it will be shaped

## 1. URL folder structure:

The folder structure in API will decide data collection that is been quired with the request

**Structure:** /api/v1/{data-collection}/{parameter-1}/{parameter-2 or descriptor}

parameter-1: id of data object that is been retrived

parameter-2: a second parameter if need or descriptor that will tell the API what the first parameter is, see example below for more

**Example 1:** /api/v1/users/568fde202127fa312543f50f/ this request will return user object

**Example 2:** /api/v1/users/93306b91-d5ba-4e06-838c-0ab85fd58783/external this request will return user object but the last folder structuer '/external' used to descripe the ID as external

## 2. URL query string:

The query string parameters is used by API to decide what is inside returned data and how it shaped

**Structure:** /api/v1/users/user-id/? {key1} & {key2}={value2} (spaces in URL added of clarity)

parameters in query string can be passed as key name only or key=value if the key has more than one value

**Example 1:** /api/v1/users/568fde202127fa312543f50f/?complete this will return all fields of requested user object, instead of only the default public fields

**Example 2 (coming soon):** /api/v1/businesses/?order=name&limit=10 this will return array of top 10 business entries order by name properties

Businesses follow the same structure, except that the api will accept a business id OR a business slug.

**Example:** /api/v1/businesses/starbucks will return all public fields of the business with slug=starbucks

## Users Api:

User fields in database identified as basic and extended the default api call will get the basic fields, extended field can retrived by add ?extnded query parameter to URL

End points
Get /api/v1/users/:id will return the user basic info
Get /api/v1/users/:id/external will return the user basic info by sending external ID e.g. user ID in firebase
Get /api/v1/users/:id?extended will return the user extended info only execluding the basic ifn

Post /api/v1/users/ add new users and will return user object with Basic info only





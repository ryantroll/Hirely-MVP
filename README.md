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
```

Importing onetScores
```
cd seeddata
curl -L https://www.dropbox.com/s/xku5xvvntq3y7ap/WeightedScores.json.zip?dl=0 -o WeightedScores.json.zip
unzip WeightedScores.json.zip
python importweightedscorestoonetscores.py
```

Importing ksawDescriptions
```
cd seeddata/ksawDescriptions
mongoimport --db hirely --collection ksawDescriptions --drop --jsonArray ContentModelRef.json
```

Importing occMetas
```
cd seeddata/occMeta
mongoimport --db hirely --drop --jsonArray occMetas.json
```

Importing ONET occupation icons
```
cd seeddata
mongoimport --db hirely --drop --type csv --headerline onetIcons.csv
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

```
cd Hirely-MVP
npm install
bower install
gulp 2>&1 >../gulp.log &
ssh mms-user@hirely-mongo-0.hirely.9550.mongodbdns.com -L 27017:127.0.0.1:27000
node server.js 2>&1 >../server.log &
open http://localhost:7200
```

What's going on?
 1. Run the css compiler 'gulp' as daemon
 2. Run server as daemon
 3. Open http://localhost:7200 in a browser


----------

# How to push code to cloud
-------------

 1. Run hirely-app/server/package-for-aws.command to create aws-package.zip
 2. Go to the following link.  Note the current version. https://console.aws.amazon.com/elasticbeanstalk/home?region=us-east-1#/environment/dashboard?applicationName=Hirely-EB7&environmentId=e-zmmmrtfdnk
 3. Upload aws-package.zip using the "Upload and Deploy" button, and increment the version by one from the prior.
 4. Elastic beanstalk will push the code to the server(s).  Babysit the deployment to ensure that it went smoothly.

Note:  The .ebextensions folder is the aws magic that gets the app working with elastic beanstalk.


----------

# How to access/ssh the cloud mongo
-------------

The cloud mongo server is on EC2 and managed by https://cloud.mongodb.com.  The current server can always be reached with the cloud.mongodb supplied dns:

ssh -i mms_key.pem mms-user@hirely-mongo-0.hirely.9550.mongodbdns.com

Also, aws is configured to allow inbound mongo ports from the elastic beanstalk VPC (virtual private network).  This includes all of our app servers:

```
mongo --port 27000 --host hirely-mongo-0.hirely.9550.mongodbdns.com hirely
```

One can also ssh forward mongo to run the app locally:

```
ssh mms-user@hirely-mongo-0.hirely.9550.mongodbdns.com -L 27017:127.0.0.1:27000
```


----------

# How to dump/export and import all mongo dbs
-------------

This should only be done on testing databases!  It's a big time-saver though for deploying demos.  Note:  this has been done once using tarballs instead of zips, but I think zips should work too and are easier to manage.

 1. Stop mongod if running:  pkill mongod
 2. Zip your local mongo db:  zip -r db.zip /data/db
 3. SCP the zip to the mongo server:  scp -i mms_key.pem db.tgz mms-user@hhirely-mongo-0.hirely.9550.mongodbdns.com:
 4. SSH to the mongo server:  ssh -i mms_key.pem mms-user@hirely-mongo-0.hirely.9550.mongodbdns.com
 5. Stop mongod if running:  pkill mongod
 6. Backup the current db if desired:  zip -r db-bak.zip /data/hirely-mongo-1
 7. Delete current db:  sudo rm -rf /data/hirely-mongo-1
 8. Unzip the new db:  unzip db.zip
 9. move the db into position:  mv db /data/hirely-mongo-1
 10. Restart the server


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




Hirely Backend and Web App
===================

This is a private repo, and is not to be shared to anyone without explicit permission by the leadership of Hirely Incorporated of Washington, DC.

This repo contains the source code for Hirely, Inc's MEAN + Mongoose ORM stack.


Overview
----------


The Hirely app is a custom MEAN stack hosted in Amazon AWS.  There are two AWS Elastic Beanstalk instances and one managed MongoDB service.  Elastic Beanstalk is an auto-scaling cloud solution by Amazon, capable of handling even the heaviest of loads.  There is one computing cloud for each of the two computing services:  web (dubbed "express") and matching algorithm (dubbed "crunchmuncher").  The web service is separated from the backend to mitigate frontend slowdown due to surges in matching algorithm demand.

The technology stack, data architecture, and API behavior have been heavily optimized for performance and scalability.

Though the matching algorithm service and web service are run independently, they share a codebase in order to simplify development. A global variable controls which mode the app runs in.  The web service handles changes to user driven data and queues matching update requests in the database.  The matching algorithm service watches for and executes match update requests.

We are using the following open-source tools and frameworks (not necessarily complete).

**Backend Webserver:**
- [Node.js](https://nodejs.org/en/) - Javascript Engine
- [Express.js](http://expressjs.com/en/index.html) - Node.js web-server framework
- [MongoDB](https://www.mongodb.com/) - NoSql db
- [Traitify Node](https://github.com/traitify/traitify-node) - Traitify library for nodejs

**3rd Party Services:**
- [Traitify](https://www.traitify.com/) - Personality Assessment as a service
- [ONET Search](https://services.onetcenter.org/demo) - Personality Assessment as a service

**Frontend Web Application:**
Functional
- [AngularJS](https://angularjs.org/) - Javascript Web Application framework
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

# The Mongo Database


The Mongo Database is hosted in AWS and managed by the official Mongo Cloud.  It can be accessed by ssh from anywhere, and mongo shell from one of our AWS server according to security policy.

If you'd like to recreate the mongodb from scratch, goto "Setup MongoDB Database Locally".

If you'd like to connect to mongo from an AWS server, goto "How to connect to mongo from an AWS server".

If you'd like to run the app locally and connect direct to the production MongoDB, goto "How to ssh tunnel the production mongo".


Installing mongodb utils
-------------

```
brew install mongodb
```


Setup MongoDB Database Locally
-------------

The app relies on several db tables be pre-populated.  The following is instructions for creating the minimum db from scratch on a mac.  It's also possible to export/import mongodb from production, but note that is painful.  For instructions on export/import, see the section "How to export/import all mongo dbs".

If in a pinch, you can also ssh tunnel the production MongoDB.

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


How to connect to mongo from an AWS server
-------------

The cloud mongo server is on EC2 and managed by https://cloud.mongodb.com.  The current server can always be reached with the cloud.mongodb supplied dns:

```
ssh -i mms_key.pem mms-user@hirely-mongo-0.hirely.9550.mongodbdns.com
```

Also, aws is configured to allow inbound mongo ports from the elastic beanstalk VPC (virtual private network).  This includes all of our app servers:

```
mongo --port 27000 --host hirely-mongo-0.hirely.9550.mongodbdns.com hirely
```


How to ssh tunnel the production mongo
-------------

If you'd like to run the app locally and connect direct to the production MongoDB

```
ssh mms-user@hirely-mongo-0.hirely.9550.mongodbdns.com -L 27017:127.0.0.1:27000
```


How to export/import all mongo dbs
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

# Running the app locally

First install the utils according to "Install app dependencies".


Install app dependencies
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



Running the server locally
-------------

```
cd Hirely-MVP
# In one terminal, run the compiler
gulp
# In another terminal, run mongo locally or ssh-tunnel to the production.  Below is the ssh-tunnel command.
ssh mms-user@hirely-mongo-0.hirely.9550.mongodbdns.com -L 27017:127.0.0.1:27000
# In another terminal, run the server
node server.js
open http://localhost:7200
```

Changing server modes
-------------

Change global var config.appMode in server/config.js

For web service mode:
config.appMode = "express"

For matching algorithm service mode:
config.appMode = "crunchMuncher"


----------

# How to deploy code to cloud

Note:  ensure config.appMode in config.production.js is correct for the beanstalk you are pushing to.

 1. Run hirely-app/server/package-for-aws.command to create aws-package.zip
 2. Go to the elastic beanstalk and upload aws-package.zip using the "Upload and Deploy" button, and increment the version by one from the prior.  Below is the url for the beanstalk of the web service. https://console.aws.amazon.com/elasticbeanstalk/home?region=us-east-1#/environment/dashboard?applicationName=Hirely-EB7&environmentId=e-zmmmrtfdnk
 3. Elastic beanstalk will push the code to the server(s).  Babysit the deployment to ensure that it went smoothly.

Note:  The .ebextensions folder is the aws magic that gets the app working with elastic beanstalk.




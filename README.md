Setup:

1. After pulling project, run npm install to download and install all the necessary packages and generate a package-lock.json
2. A MongoDB will need to be setup prior. You can download and install a community server in your local here: https://www.mongodb.com/try/download/community. Note if you make any changes to the default localhost, you will need to update
the change in db.js file to reflect it so it is still able to connect.
3. After this, please run node server.js. If you do not want the database table "Users" to be deleted after starting it each time, please remove the code from lines 6 and 7 in db.js.
4. Your server should now be running. You can confirm by going to http://localhost:27017/ assuming you didn't change any defaults.

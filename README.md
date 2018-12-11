## Node app reference

THIS PROJECT GENERATES THE FOLLOWING CODE EXAMPLES,
SO NONE OF THESE STEPS ARE REQUIRED PER SAY, THOUGH SOME OF THIS DOCUMENTATION IS WRITTEN TO HELP YOU WORK WITH THE PROJECT AND UNDERSTAND SOME OF ITS PIECES

### In the .gitignore file

- hide the `node_modules` folder from git, and any files that don't belong in the git tracking, like the .env file. Just list the file/folder name only, and put the next entry on the next line in the file. If there are folders or files nested in the folder structure of the project, place a forward slash at the end of the file/folder name in the .gitignore and it will be hidden from git no matter where it is in the project folder structure. So for example `node_modules/` or `some_file.txt/` will be hidden from git no matter how far down the folder structure they are, as long as the .gitignore file is at the top of the folder structure

---

### In the .env file

- make sure the `.env` file is in the same folder as the main server file
- make sure `.env` is added to the .gitignore file
- add your sensitive info in the .env file, each entry on it's own line

```
SECRET_PASS="secretstuff"
MORE_SECRET_INFO="somesecrets"
```

- at the top of the main server file add this bit of code so that the environment variables will become available on process.env

```
if (process.env.NODE_ENV == 'development') {
    require('dotenv').config()
}
```

- IN ORDER FOR DOTENV TO WORK, where index.js is started, wether from an npm script or from the command line,
  add NODE_ENV=development right before nodemon or node index.js so like `NODE_ENV=development nodemon index.js` for example

---

### In the package.json

#### it can be easier to host the static frontend separately, but the following takes into account having a "client" folder and hosting it all on heroku, in such a case, it is important to prefix the api routes with /api so that they do not conflict with the front end route names. So for example the api endpoint /users should be prefixed with /api, like /api/users

- for development:
  - adjust the `server` and `client` script accordingly, the important thing is that the `dev` script will run both the `server` and `client` script at the exact same time in the same terminal tab

```
"dev": "concurrently --kill-others-on-fail \"npm run server\" \"npm run client\"",
"server": "NODE_ENV=development nodemon --ignore client ./index.js",
"client": "cd client && npm run start"
```

( `"client": "cd client && npm run start"` start is an example of what the script is called in the client folder's `package.json` that starts the dev process for the client )

- for production: \* add a `start` script to the `package.json` scripts, this script will be used by heroku to start the main server: `"start": "node ./index.js"`

---

## In the main server file

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const path = require("path");
// const mustacheExpress = require('mustache-express') // example for using server side views

// I mentioned this bit of code already, just make sure that it's in the server once at the top of the file
if (process.env.NODE_ENV == "development") {
  require("dotenv").config();
}

const app = express();

// this is so that express can parse the incoming `req.body` into json, somewhere at the top of the server file:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// if the app is using server side templating like mustache:
// make sure to create a views folder
// app.engine('mustache', mustacheExpress())
// app.set('views', './views')
// app.set('view engine', 'mustache')

// set usefull headers:
app.all("*", function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
  );
  next();
});

// to prevent security threats, Helmet will set headers to sensible defaults, and allows tweaking them as needed:
app.use(helmet());

// ROUTES GO HERE
app.get("/api/test", function(req, res, next) {
  res.send("the api is working");
});

// below all of the routes:
if (process.env.NODE_ENV === "production") {
  // if the client is a create-react-app, go to the .gitignore in the client folder, and take out
  // the word 'build' so that it isn't hidden from git and heroku

  // serves up the static files
  app.use(express.static("client/build"));
  // if the app is a single page app, like a react app that uses react router for example
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
  );
}

// at the bottom of the server file, set the port like this, so that heroku can set the port when the server is being hosted there
const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log(
    "\n\n===== listening for requests on port " + PORT + " =====\n\n"
  );
});
```

## setting up the environment variables in Heroku

- we used the dotenv package to apply environment variables to process.env, in production, we also need the same environment variables, and heroku allows us to do that
  [setting config vars in heroku](https://postimg.cc/wyCzb2wD)
  [![setting config vars in heroku](https://i.postimg.cc/D0Zz0Ysp/321-imported-1443570183-321-imported-1443554644-389-original.png)](https://postimg.cc/wyCzb2wD)

- heroku environment variable docs https://devcenter.heroku.com/articles/config-vars

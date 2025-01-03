// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/:date?", function (req, res) {
  const date = req.params.date;
  const UTCpattern = /^\d{4}-\d{2}-\d{2}$/;  // Matches a UTC date format (YYYY-MM-DD)
  const UNIXpattern = /^-?\d{10,13}$/;      // Matches Unix timestamp (in seconds or milliseconds)

  try {
    if (!date) {
      const now = new Date();
      const currentUTC = now.toUTCString();
      const currentUNIX = Date.now();  // This returns the timestamp in milliseconds
      res.json({ unix: currentUNIX, utc: currentUTC });
    } else if (UTCpattern.test(date)) {
      // Handling a UTC date string
      let utcDate = new Date(date);  // Convert the string to a Date object
      if (isNaN(utcDate)) {
        throw new Error("Invalid Date");
      }
      let unixDate = utcDate.getTime();  // getTime() returns the timestamp in milliseconds
      res.json({ unix: unixDate, utc: utcDate.toUTCString() });
    } else if (UNIXpattern.test(date)) {
      // Handling a Unix timestamp
      let unixDate = parseInt(date, 10);  // Convert to integer (in case the timestamp is a string)
      let utcString = new Date(unixDate).toUTCString();
      if (isNaN(unixDate)) {
        throw new Error("Invalid Date");
      }
      res.json({ unix: unixDate, utc: utcString });
    } else {
      throw new Error("Invalid Date");
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3001, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

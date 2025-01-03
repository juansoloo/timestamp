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
  const date = req.params.date; // Matches a UTC date format (YYYY-MM-DD)
  const UNIXpattern = /^-?\d{10,13}$/;      // Matches Unix timestamp (in seconds or milliseconds)

  try {
    if (!date) {
      const now = new Date();
      const currentUTC = now.toUTCString();
      const currentUNIX = Date.now();  // This returns the timestamp in milliseconds
      res.json({ unix: currentUNIX, utc: currentUTC });
    } else if (UNIXpattern.test(date)) {
      // Handling a UTC date string
      let unixDate = parseInt(date,10);
      let utcString = new Date(unixDate).toUTCString();  // Convert the string to a Date object
      if (isNaN(unixDate)) {
        throw new Error("Invalid Date");
      }
      res.json({ unix: unixDate, utc: utcString });
    } else {
      let utcDate = new Date(date);
      if (isNaN(utcDate)) {
        throw new Error("Invalid Date");
      }
      let unixDate = utcDate.getTime();
      res.json({ unix: unixDate, utc: utcDate.toUTCString() });
    } 
  } catch (err) {
    res.json({ error: err.message });
  }
});


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3001, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

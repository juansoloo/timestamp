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
  const UTCpattern = /^\d{4}-\d{2}-\d{2}$/
  const UNIXpattern = /^-?\d{10,13}$/
  try {
    if (!date) {
      const now = new Date();
      const currentUTC = now.toUTCString()
      const currentUNIX = Date.now();
      res.json({ unix: currentUNIX, utc: currentUTC })
    } else if (UTCpattern.test(date)) {
      let splitDate = date.split('-')
      let utcDate = new Date(splitDate[0],splitDate[1] - 1,splitDate[2])
      let unixDate = utcDate.getTime() / 1000;

      if (isNaN(utcDate)) {
        throw new Error("Invalid Date")
      }

      res.json({ unix : unixDate, utc: utcDate.toUTCString() });
    } else if (UNIXpattern.test(date)){
      let unixToUtc = new Date(date * 1000);
      let utcString = unixToUtc.toUTCString();

      if (isNaN(unixToUtc)) {
        throw new Error("Invalid Date")
      }

      res.json({ unix: date, utc: utcString });
    } else {
      throw new Error("Invalid Date")
    }
  } catch (err) {
    res.json({error: err.message})
  }
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3001, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (_req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = `https://us9.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;
  const options = {
    method: "POST",
    auth: `abhinay:${process.env.API_KEY}`,
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`Server is running ${PORT} port`);
});

// TODO: remove this comment, shouldn't keep such secrets in the code itself.

//API Key
//e16d5419ed606a4a3872476a90049890-us9
//list id
//c03c66bb24.

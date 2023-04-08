const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us9.api.mailchimp.com/3.0/lists/c03c66bb24";
  const options = {
    method: "POST",
    auth: "abhinay:e16d5419ed606a4a3872476a90049890-us9"
  }
  const request = https.request(url, options, function(response) {
   if(response.statusCode===200){
     res.sendFile(__dirname+"/success.html");}
     else{res.sendFile(__dirname+"/failure.html");}




    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
res.redirect("/");
})
app.listen(3000, function() {
  console.log("Server is running 3000 port");

});
//API Key
//e16d5419ed606a4a3872476a90049890-us9
//list id
//c03c66bb24.

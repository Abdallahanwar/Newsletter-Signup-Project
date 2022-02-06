const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public")); //to run the local css files and images

app.use(bodyParser.urlencoded({extended: true})); //to use body parser on project

app.get("/",function(req,res)
{
  res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res)
{
  const first = req.body.First;
  const last = req.body.Last;
  const email = req.body.Email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: first,
          LNAME: last
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);//حولنا الداتا ل سترينج
  const url = "https://us1.api.mailchimp.com/3.0/lists/1da3460640"//url from the mailchimp doc.
  const options = {
    method: "POST",
    auth: "abd:d02db0354ace6be24f7cc71cfae06878-us1"
  }

  const request = https.request(url,options,function(response)//to request from mailchimp
{
  if(response.statusCode == 200)
  {
    res.sendFile(__dirname+"/success.html");
  }
  else{
    res.sendFile(__dirname+"/failure.html");
  }
response.on("data",function(data)// to response to the data enter from the user
{
  console.log(JSON.parse(data));// convert the data to JSON form
})

})
request.write(jsonData);//to send data enter from user to the mailchimp server
request.end();
});

app.post("/failure",function(req,res)//to run the button try again
{
  res.redirect("/");// to return to home page
})


//api key for mailchimp
//d02db0354ace6be24f7cc71cfae06878-us1

//id_list
//1da3460640



app.listen(process.env.PORT || 3000,function()
{
  console.log("server is running on port 3000.");
})

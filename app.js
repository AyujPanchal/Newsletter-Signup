//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req, res){
    const fname = req.body.FName;
    const lname = req.body.LName;
    const email = req.body.Email;
    const data = {
        'members': [
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ],
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us1.api.mailchimp.com/3.0/lists/7be537763d";
    const options = {
        method: "POST",
        auth: "Ayuj:556edc60366c13d1045346329f352e80-us1"
    }

    const request = https.request(url, options, function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req, res){
    res.redirect("/");
});

app.set( 'port', ( process.env.PORT || 5000 ));

app.listen(app.get('port'), function () {
    console.log("server is running on port 5000.");
});

// Api key
// 556edc60366c13d1045346329f352e80-us1

// list id 
// 7be537763d
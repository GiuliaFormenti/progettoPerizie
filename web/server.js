"use strict";

/* ********************** Global requirements & management variables ********************** */

//Server
const http = require("http");

const express = require("express");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 1337;

const SRVR_LOG = ">>>>>>>> ";
let errorPage;

//DB - Mongo
let mongo = require("mongodb");
let ObjectID=mongo.ObjectID;
let mongoClient = mongo.MongoClient;
//const CONNECTIONSTRING = "mongodb+srv://admin:adminpassword@progettoperizie.r13yb.mongodb.net";///<ProgettoPerizie>
const CONNECTIONSTRING = process.env.MONGODB_URI;
//"mongodb+srv://admin:pE9PizJIfxgDLnUE@agenversinc.sxicg.mongodb.net"
//mongo "mongodb+srv://progettoperizie.r13yb.mongodb.net/<dbname>" --username admin
const CONNECTIONOPTIONS = {useNewUrlParser: true, useUnifiedTopology: true};
const DBNAME = "perizie";

//nodemailer
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'noreply.rilieviperizie@gmail.com',
      pass: 'dr0wss4p'
    }
});
let _prefix="localhost:1337";//"https://agenversinc.herokuapp.com/"


//Login & registration
let bcrypt = require("bcryptjs");
var CryptoJS = require("crypto-js");
let jwt = require("jsonwebtoken");
const generator = require('generate-password');
const TTL = 2592000000;//30 giorni
const NO_COOKIES="No cookies found";
let PRIVATE_KEY;

//Cloudinary
const cloudinary = require("cloudinary").v2;
const CLOUDINARY_URL="cloudinary://557341525913954:acu0aY3YDVMRxtLZAZiJcpA9N-0@rilievi-e-perizie";
cloudinary.config({
    cloud_name: 'rilievi-e-perizie',
    api_key: '557341525913954',
    api_secret: 'acu0aY3YDVMRxtLZAZiJcpA9N-0'
});

  //Other
const colors = require("colors");
const fs = require("fs");
const bodyParser = require("body-parser");
const { find } = require("async");
const { connected } = require("process");
let myToken;
//const path = require('path');

//Loading error page.
init();

/* ********************** Starting listening server and socket function declaration ********************** */

server.listen(PORT, function () {
    console.log(`${colors.green("[" + new Date().toLocaleTimeString() + "]")}${SRVR_LOG}Server listening on port: ${PORT}`);
});

/* ********************** Functions ********************** */
/*
 * Prepare or make the error displayed page.
 */
function init() {
    fs.readFile("./static/error.html", function (err, data) {
        if (!err)
        {
            errorPage = data.toString();
        }
        else
        {
            errorPage = '<h1 style="color:red;text-align:center;">- Page or resource not found -</h1><br><a class="btn btn-primary" style="margin:0 auto;" href="/index.html">Home</a>';
        }
    });
    fs.readFile("./private.key", function(err,data){
        if(!err)
        {
            PRIVATE_KEY = data.toString();
        }
        else
        {
            console.log("The private key is missing");
            server.close();
        }
    });

    app.response.log=function(message){
        console.log(message);
    }
}

/*
 * Write the data that recive as a parameter after date and hour.
*/
function log(data) {
    console.log(`${colors.cyan("[" + new Date().toLocaleTimeString() + "]")} ${data}`);
}

/*
 * Search if a user is already logged in.
*/
function findUser(username, room)
{
	return users.find(function(item){
		return (item.username==username && item.room==room)
	});
}

function checkToken(req, res, next, method="GET") {
    let token = readCookie(req);
    if(token == NO_COOKIES)
    {
        //res.status(403).send("Token mancante");
        sendError(req, res, 403, "Token mancante");
    }
    else
    {
        jwt.verify(token, PRIVATE_KEY, function(err, payload){
            if(err)
            {
                //res.status(403).send("Token scaduto o corrotto");
                sendError(req, res, 403, "Token scaduto o corrotto");
            }
            else
            {
                
                let newToken = createToken(payload); //devo ricreare il token perchè cambiando exp la firma di prima non sarebbe più valida
                writeCookie(res, newToken);
                req.payload = payload; //salvo il payload dentro request cosi tutte le api successive lo possono leggere
                next();
            }
        });
    }
}

function sendError(req, res, cod, errMex)
{
    
    res.sendFile(`${__dirname}/static/login.html`);
}

function setTokenAndCookie(payload, res){
    let newToken = createToken(payload);
    myToken = newToken;
    writeCookie(res, newToken);
}

function readCookie(req){
    let valoreCookie = NO_COOKIES;
    if(req.headers.cookie)
    {
        let cookies=req.headers.cookie.split(";");
        for(let item of cookies)
        {
            item=item.split("="); //item da chiave=valore --> [chiave, valore]
            if(item[0].includes("token"))
            {
                valoreCookie=item[1];
                break;
            }
        }
      
    }
    console.log(valoreCookie);
    return valoreCookie;
}

//data --> record dell'utente
function createToken(data){
    //sign() --> si aspetta come parametro un json con i parametri che si vogliono mettere nel token
    let param = {
        "_id":data["_id"],
        "username":data.username,
        "email":data.email,
        "iat":data.iat || Math.floor(Date.now()/1000),
        "exp":Math.floor(Date.now()/1000)+TTL
    }
    let token = jwt.sign(param, PRIVATE_KEY);
    return token;
}

function writeCookie(res, token, expires=TTL){
    //set() --> metodo di express che consente di impostare una o più intestazioni nella risposta HTTP    createCookie(token, expires)
    res.set("Set-Cookie", `token=${token};expires=${expires};path=/;httponly=true;`);//res.set("Set-Cookie", `token=${token};expires=${expires};path=/;httponly=true;`);
}

/* ********************** Express listener ********************** */

app.use(express.json({limit:'1000mb'}));

app.use("*",function(req,res,next){
    console.log(">>>>>>>> Risorsa: "+req.originalUrl.split('?')[0]+".");
    res.setHeader("Access-Controll-Allow_Origin","*");
    next();
});

//Route di lettura dei parametri post.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/", function (req, res, next) {
    res.setHeader("Access-Controll-Allow-Origin", "");
    res.setHeader("Access-Controll-Allow-Headers", "");
    res.setHeader("Access-Controll-Allow-Credientials", true);
    next();
});

//Ropute di log dei parametri.
app.use("/",function(req,res,next){
    if(Object.keys(req.query).length > 0)
    {
        console.log(">>>>>>>> Parametri: " + JSON.stringify(req.query) + ".");
    }
    if(Object.keys(req.body).length > 0)
    {
        console.log(">>>>>>>> Parametri: " + JSON.stringify(req.body) + ".");
    }
    next();
});

app.get("/api/findAll/", function(req, res, next){
    mongoClient.connect(CONNECTIONSTRING, CONNECTIONOPTIONS, function(err, client) {
        if (err)
        {
            res.status(503).send("Database connection error.");
        }
        else
        {
            let db = client.db(DBNAME);
            let collection = db.collection('photos');

            collection.find({}).toArray().then(items => {
                /*console.log(`Successfully found ${items.length} documents.`)
                items.forEach(console.log)
                //return items*/
                if(items.length > 0)
                {
                    res.send({"data": items});
                }
                else
                {
                    res.send({"data": "no-data"});
                }
            });
        }
    });
});

app.post("/api/upPhoto/", function(req, res, next){
    mongoClient.connect(CONNECTIONSTRING, CONNECTIONOPTIONS, function(err, client) {
        if (err)
        {
            res.status(503).send("Database connection error.");
        }
        else
        {
            let id = req.body["id"];
            let username = req.body["username"];
            let images = req.body["images"];
            let lat = req.body["lat"];
            let lng = req.body["lng"];
            let dataOra = req.body["dataOra"];
            let note = req.body["note"];
            
            let db = client.db(DBNAME);
            let collection = db.collection('photos');
            
            collection.insertOne({"_idUser": id, "username": username, "lat": lat, "lng": lng, "dataOra": dataOra, "note": note, "image": images},function(err,data){
                if (err)
                {
                    res.status(500).send("Internal Error in Query Execution.");
                }
                else
                {
                    res.send({"ris": "ok"});
                    //client.close();
                }
                client.close();
            });
        }
    });
});

app.post("/api/uploadImage/", function(req, res, next){
    let file = `data:image/jpeg;base64,${req.body.image}`;
    
    cloudinary.uploader.upload(file)
    .then((result) => {
      res.send({
        message: "success",
        result,
      });
    }).catch((error) => {
      res.status(500).send({
        message: "failure",
        error,
      });
    });
})

app.get("/api/findMail/", function(req, res, next){
    mongoClient.connect(CONNECTIONSTRING, CONNECTIONOPTIONS, function(err, client) {
        if (err)
        {
            res.status(503).send("Database connection error.");
        }
        else
        {
            let mail = req.query.mail;

            let db = client.db(DBNAME);
            let collection = db.collection('users');

            collection.findOne({"mail":mail}, function(err, data){
                if (err) 
                {
                    res.status(500).send("Internal Error in Query Execution.");
                } 
                else 
                {
                    if(data)
                    {
                        res.send({ "ris" : "nok" });
                    }
                    else
                    {
                        res.send({ "ris" : "ok" });
                    }
                }
                client.close();
            });
        }
    });
});

app.get("/api/findUser/", function(req, res, next){
    mongoClient.connect(CONNECTIONSTRING, CONNECTIONOPTIONS, function(err, client) {
        if (err)
        {
            res.status(503).send("Database connection error.");
        }
        else
        {
            let username = req.query.username;

            let db = client.db(DBNAME);
            let collection = db.collection('users');

            collection.findOne({"username": username}, function(err, data){
                if (err) 
                {
                    res.status(500).send("Internal Error in Query Execution.");
                } 
                else 
                {
                    if(data)
                    {
                        res.send({ "ris" : "nok" });
                    }
                    else
                    {
                        res.send({ "ris" : "ok" });
                    }
                }
                client.close();
            });
        }
    });
});

/*app.post("/api/pwd/", function(req, res, next){
    res.send({"pwd": bcrypt.hashSync(req.body.password,10)});
});*/

app.post("/api/signUp/", function(req, res, next){
    mongoClient.connect(CONNECTIONSTRING, CONNECTIONOPTIONS, function(err, client){
        if (err)
        {
            res.send({"ris": "nok"});
            res.status(503).send("Database connection error.");
        }
        else
        {
            let username = req.body.username;
            let mail = req.body.mail;
            let password = generateRandomPassword(8, true);
            let passwordCrypt = bcrypt.hashSync(CryptoJS.MD5(password).toString(), 10);

            let db = client.db(DBNAME);
            let collection = db.collection('users');
            collection.insertOne({"username": username, "mail": mail, "password": passwordCrypt},function(err,data){
                if (err)
                {
                    res.status(500).send("Internal Error in Query Execution.");
                }
                else
                {
                    collection.findOne({"mail":mail}, function(err, data){
                        if(err)
                        {
                            res.status(500).send("Internal server error.");
                        }
                        else
                        {
                            let mailOptions = {
                                from: 'noreply.rilieviperizie@gmail.com',
                                to: mail,
                                subject: 'Your temporary password',
                                //text: 'Prova' // invia il corpo in plaintext
                                html: `<h3>Good ${username}!</h3><br><p>${req.body.msg}<br>Your temporary pasword is <b>${password}</b>.<br> Now you can Sign in."</p>`  // invia il corpo in html
                            };

                            // invio il messaggio
                            transporter.sendMail(mailOptions, function(error, info){
                                if(error)
                                {
                                    console.log("Error on sending message:     "+ error);
                                    res.send({"ris":"nok"});
                                }
                                else
                                {
                                    res.send({"ris":"ok"});
                                }
                            });
                            //client.close();
                        }
                        client.close();
                    });
                }
            });
        }
    });
});

app.post('/api/login', function(req, res, next) {
    mongoClient.connect(CONNECTIONSTRING, CONNECTIONOPTIONS, function(err, client) {
        if (err)
        {
            console.log("NO");
            res.status(503).send("Database connection error.");
        }
        else
        {
            let db = client.db(DBNAME);
            let collection = db.collection('users');

            let username = req.body.username;
            let pwd = req.body.password;
            //console.log("Username: " + username + " - Password: " + pwd);
            collection.findOne({"username": username}, function(err, dbUser) {
                if (err)
                {
                    res.status(500).send("Internal Error in Query Execution.");
                }
                else
                {
                    if (dbUser == null)
                    {
                        res.status(401).send("Email or password not correct.");
                    }
                    else
                    {
                        console.log(dbUser.username + "    " + dbUser.password);
                        bcrypt.compare(pwd, dbUser.password, function(err, ok) {
                            if (err)
                            {
                                res.status(500).send("Internal Error in bcrypt compare.");
                            }
                            else
                            {
                                if (!ok)
                                {
                                    console.log("UFFA")
                                    res.status(401).send("Password not correct.");
                                }
                                else
                                {
                                    setTokenAndCookie(dbUser, res);
                                    //res.send({"file":"../index.html", "gender":dbUser.gender});
                                    res.send({"user": dbUser});
                                }
                            }
                        });
                    }
                }
                client.close();
            });
        }
    });
});

app.use("/api", function(req, res, next){
    checkToken(req, res, next);
});
app.get("/", function(req, res, next){
    checkToken(req, res, next);
});
app.get("/index.html", function(req, res, next){
    checkToken(req, res, next);
});
app.get("/nuovoUtente.html", function(req, res, next){
    checkToken(req, res, next);
});


app.post("/api/sendImage", function(req, res, next){
    let file = req.body.file;
    cloudinary.uploader.upload(file, function(error, result)
    {
        res.send(result);
    });
});

app.post("/api/checkToken", function (req, res, next) {
    let token = checkToken(req, res, next, "POST");
    if(token["ris"] != "noToken")
    {
        
        res.send({"id": "ok"});
    }
    else
    {
        res.send(token);
    }
});

app.post("/api/sendImage", function(req, res, next){
    let file = req.body.file;
    cloudinary.uploader.upload(file, function(error, result)
    {
        res.send(result);
    });
});

app.post("/api/check", function(req, res, next){
    res.status(500).send("ok");
});


app.use("/api", checkToken);


app.post('/api/logout', function(req, res, next) {
    res.set("Set-Cookie", "token=;max-age=-1;Path=/;httponly=true;");
    res.send({"ris": "ok"});
});



app.post("/api/updateUser", function (req, res, next)
{
    let set = {};
    let email = req.body.mail;
    let name=req.body.username;
    let password = req.body.password;

    mongoClient.connect(CONNECTIONSTRING, CONNECTIONOPTIONS, function (err, client) {
        if (err)
        {
            res.status(503).send("Database connection error.");
        }
        else 
        {
            let db = client.db(DBNAME);
            let collection = db.collection('users');

            collection.findOne({ "mail" : email }, function (err, dataUser) 
            {
                if (err) 
                {
                    res.status(500).send("Internal Error in Query Execution.");
                } 
                else 
                {
                    if(name != "" && name != dataUser.username)
                    {
                        set.username=name;
                    }
                    if(password != "" && !(bcrypt.compareSync(password, dataUser.password)))
                    {
                        set.password = bcrypt.hashSync(password, 10);
                    }

                    if(set != {})
                    {
                        collection.updateOne({ "mail": email }, { $set: set },
                        function (err, data) 
                        {
                            if (err) 
                            {
                                res.status(500).send("Internal server error.");
                            } 
                            else 
                            {
                                res.send(data);
                            }
                            client.close();
                        });
                    }
                    else
                    {
                        res.status(500).send({"ris": "empty"});
                    }
                }
            });
        }
    });
});

app.post("/api/updateNote/", function(req, res, next){
    mongoClient.connect(CONNECTIONSTRING, CONNECTIONOPTIONS, function(err, client){
        if (err)
        {
            res.status(503).send("Database connection error.");
        }
        else
        {
            let db = client.db(DBNAME);
            let collection = db.collection('photos');
            let oId = req.body["oId"];
            let notes = req.body["note"];

            collection.updateOne({"_idUser":oId},{$set:{"note": notes}}, function(err, data){
                if(err)
                {
                    res.status(500).send("Internal server error.");
                }
                else
                {
                    res.send(data);
                }
            });
        }
    });
});

function generateRandomPassword(lenght, isAlsoNumeric)
{
    return generator.generate({
        length: lenght,
        numbers: isAlsoNumeric
    });
}

app.get("/userManagement.html", checkToken);

//Route relativa alle risorse statiche
app.use('/', express.static("./static"));

/*
* If no previous route is valid for the request this one is done. Send the error page.
*/
app.use("*",function(req,res,next){
    res.status(404);
    if(req.originalUrl.startsWith("/api/"))
    {
        //res.json("Sorry, can't find the resource you are looking for.");
        res.send("Resource not found.");
    }
    else
    {
        res.send(errorPage);
    }
});

/*
* If the server generate an error this route is done. Send the http response code 500.
*/
app.use(function(err, req, res, next) {
    console.log(err.stack); //Stack completo (default).
    if (!err.codice)
    {
        err.codice = 500;
        err.message="Internal Server Error.";
        //server.close();
    }
    res.status(err.codice);
    res.send(err.message);
});
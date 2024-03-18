const { faker } = require('@faker-js/faker');

const express=require("express");
const app=express();
let path=require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));

const mysql=require('mysql2');
const { connect } = require('http2');

const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    database : "delta_app",
    password : "Sunny@2001",
});


let getRandomUser=()=>{
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
}

app.listen("5000",()=>{
    console.log("Listening request to the 5000p");
})

app.get("/",(req, res)=>{
    let q="select count(*) from user;"
    try{
        connection.query(q, (err, result)=>{
            if(err) {
                throw err;
            };
            let count=result[0]['count(*)'];
            res.render("home.ejs", {count});
        });
 
    }catch(err){
        res.send("Error in DB");
    }
})

app.get("/user/search", (req, res)=>{
    res.render("user.ejs");
})

app.get("/user/:username", (req, res)=>{
    let {username}=req.params;
    let q=`select * from user where username=${username}`;
    try{
        connection.query(q, (err, result, fields)=>{
            if(err){
                throw err;
            };
            console.log(result);
            res.render("showuser.ejs", {result});
        })
    }catch(err){
        res.send("Error in DB");
    }
})

app.get("/user", (req, res)=>{
    try{
        let q="select * from user";
        connection.query(q, (err, result)=>{
            if(err) throw err;
            res.render("showuser.ejs",{result});
        })
    }catch(err){
        res.send("Error in DB");
    }
})


// let q="insert into user(id, username, email, password) values ?";
// let data=[];
// for(let i=1;i<=100;i++){
//     data.push(getRandomUser());
// }

// try{
//     connection.query(q, [data],(err, result, fields)=>{
//         if(err){
//             throw err;
//         }
//         console.log(result);
        
//     })

// }catch(err){
//     console.log(err);
// }

// let q="Select count(*) from user;"

// try{
//     connection.query(q, (err, result)=>{
//         if(err){
//             throw err;
//         }
//         console.log(result);
//     })
// }catch(err){
//     console.log(err);
// }

// connection.end();



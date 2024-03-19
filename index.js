/*const { faker } = require('@faker-js/faker');

const express=require("express");
const app=express();
let path=require("path");
methodOverride=require("method-override");

app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));

const mysql=require('mysql2');
const { connect } = require('http2');*/

const { faker } = require('@faker-js/faker');

const express=require("express");
const app=express();
let path=require("path");
const methodOverride=require("method-override");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));

const mysql=require('mysql2');
const { v4: uuidv4 } = require('uuid');
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

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
app.post("/user/search", (req, res)=>{
    let {username}=req.body;
    let q=`select * from user where username='${username}'`;
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

app.get("/user/search", (req, res)=>{
    res.render("user.ejs");
})

app.get("/user/:id/edit",(req, res)=>{
    let {id}=req.params;
    console.log(id);
    let q=`select * from user where id='${id}'`;
    try{
        connection.query(q, (err, result, fields)=>{
            if(err) throw err;
            let userData=result[0];
            res.render("edit.ejs",{userData});
        })
    }catch(err){
        res.send("err in db");
    }
})

app.patch("/user/:id",(req, res)=>{
    let {id}=req.params;
    let {username : newUserName, password : formPass}=req.body;
    let q=`select * from user where id='${id}'`;
    try{
        connection.query(q, (err, result, fields)=>{
            if(err) throw err;
            let userData=result[0];
            console.log(userData);
            if(formPass!=userData.password){
                res.send("Wrong Password");
            }else{
                let q2=`update user set username='${newUserName}' where id='${id}'`;
                connection.query(q2, (err, result)=>{
                    if(err) throw err;
                    res.redirect("/user");
                })
            }
        })
    }catch(err){
        res.send("err in db");
    }
})

app.get("/user/new", (req, res)=>{
    res.render("newEntry.ejs");
})

app.post("/user", (req, res)=>{
    let id=uuidv4();
    let{username : user, email : mail, password : pass}=req.body;
    let q=`insert into user(id, username, email, password) values ('${id}', '${user}', '${mail}', '${pass}')`;
    try{
        connection.query(q, (err, result, fields)=>{
            if(err) throw err;
            console.log(result);
            res.redirect("/user");
        })
    }catch(err){
        res.send("Error in DB");
    }
})

app.get("/user/:id/delete", (req, res)=>{
    let{id}=req.params;
    res.render("deletePage.ejs",{id});
})

app.delete("/user/:id",(req, res)=>{
    let {id}=req.params;
    let {username : user, password : pass}=req.body;
    let q=`select * from user where id='${id}'`;
    try{
        connection.query(q, (err, result, fields)=>{
            if(err) throw err;
            let userData=result[0];
            if(userData.username==user && userData.password==pass){
                let q2=`delete from user where id='${userData.id}'`;
                connection.query(q2, (err, result, fields)=>{
                    if(err) throw err;
                    console.log(result);
                    res.redirect("/user");
                })
            }
            else{
                res.send("Wrong Username & Password");
            }
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

// app.get("/user/:username", (req, res)=>{
//     let {username}=req.params;
//     let q=`select * from user where username=${username}`;
//     try{
//         connection.query(q, (err, result, fields)=>{
//             if(err){
//                 throw err;
//             };
//             console.log(result);
//             res.render("showuser.ejs", {result});
//         })
//     }catch(err){
//         res.send("Error in DB");
//     }
// })


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



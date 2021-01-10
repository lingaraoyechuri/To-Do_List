const express = require('express');
const bodyparser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

var path = require('path');

var task = [];
var work = [];

const date1 = require( __dirname + "/date.js");

var test = date1.getDate();
console.log(test);
//var today  = new Date();
//var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//var date = today.toLocaleDateString("en-US", options);

app.get('/todo', (req, res) => {
//  let day = date1();
  res.render("index", {Today:test, newtask:task});

});

app.post('/', (req, res) => {
 console.log(req.body);
  if(req.body.list === "Work-List"){
    work.push(req.body.task);
    console.log(req.body.task);
    res.redirect("/work")
  }else {
    task.push(req.body.task);
    console.log(req.body.task);
    res.redirect("/todo")
  }

});

app.get('/work', (req, res) => {

  res.render("index", {Today:"Work-List", newtask:work});

});


app.listen(8085, function() {

  console.log("server is working");
});

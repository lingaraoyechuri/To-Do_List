const express = require('express');
const bodyparser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todo', {useNewUrlParser: true, useUnifiedTopology: true});

var path = require('path');

const tasklist = mongoose.model('tasklist', {
  taskName: {
   type: String,
  }
});


var work = [];

const date1 = require( __dirname + "/date.js");

var test = date1.getDate();
console.log(test);
//var today  = new Date();
//var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//var date = today.toLocaleDateString("en-US", options);



app.get('/todo', (req, res) => {
  var task = [];
//  let day = date1();
  tasklist.find(function(err, tasks){
    if(err){
      console.log(err);
    }else {
      // tasks.forEach((item, i) => {
      //   console.log(item.name);
      //   console.log(i);
      // });
      console.log(tasks);

      tasks.forEach((item)=>{
          console.log("items"+item);
          if(item.taskName != null){
            console.log(item.taskName);
            task.push(item.taskName);
          }
      });

      res.render("index", {Today:test, newtask:task});
    //  task.delete();
    }
  })


});

app.post('/', (req, res) => {
 console.log(req.body);
  if(req.body.list === "Work-List"){
    work.push(req.body.task);
    console.log(req.body.task);
    res.redirect("/work")
  }else {
    //task.push(req.body.task);
    const newTask = new tasklist({taskName:req.body.task});
    newTask.save().then(() => console.log('saved'));
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

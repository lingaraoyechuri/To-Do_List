const express = require('express');
const bodyparser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todo', {useNewUrlParser: true, useUnifiedTopology: true});

var path = require('path');
const taskschema =  new mongoose.Schema ({
  taskName: {
   type: String
  }
});

const tasklist = mongoose.model('tasklist', taskschema);

const task1 = new tasklist({taskName: "sleeping"});
const task2 = new tasklist({taskName: "eating"});
const task3 = new tasklist({taskName: "coding"});

const defaultTasks = [task1, task2, task3];

const customList = mongoose.model('customList', {
  listName: String,
  tasks: [taskschema]
});




var work = [];

const date1 = require( __dirname + "/date.js");

var test = date1.getDate();
console.log(test);
//var today  = new Date();
//var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//var date = today.toLocaleDateString("en-US", options);

app.get('/', (req, res) =>{

});

app.get('/:customListName', (req, res) => {
  var task = [];
//  let day = date1();


  console.log("path"+req.params.customListName);
  if(req.params.customListName == "todo"){
    tasklist.find(function(err, tasks){
      if(err){
        console.log(err);
      }else {
        console.log(tasks);
        res.render("index", {Today:"Today", newtask:tasks});
      }
    })
  }else if (req.params.customListName == "work") {
    res.render("index", {Today:"Work-List", newtask:work});
  }else {
    customList.findOne({listName: req.params.customListName}, function(err,foundlist) {
       console.log("result"+foundlist);
       if(foundlist == null){
         const workList1 = new customList({listName: req.params.customListName, tasks: defaultTasks});
         workList1.save();
         res.redirect("/"+req.params.customListName);
       }else {
         console.log("already exists");
         res.render("index", {Today:foundlist.listName, newtask:foundlist.tasks});
       }
    });

  }
});

app.post('/', (req, res) => {
 console.log(req.body);
 console.log("req.body.list"+req.body.list);

  if(req.body.list === "Work-List"){
    work.push(req.body.task);
    console.log(req.body.task);
    res.redirect("/work")
  }else if(req.body.list == "Today") {
    //task.push(req.body.task);
    const newTask = new tasklist({taskName:req.body.task});
    newTask.save().then(() => console.log('saved'));
    console.log(req.body.task);
    res.redirect("/todo")

  }else {
    customList.findOne({listName: req.body.list}, function(err,foundlist) {
      console.log("foundlist"+ foundlist);
      const newtask = new tasklist({taskName: req.body.task});
      foundlist.tasks.push(newtask);
      foundlist.save();
      console.log("foundlist"+foundlist);
      res.redirect("/"+ req.body.list);
    });
  }
});

app.post('/delete', (req, res) => {
 console.log("indide delete test"+req.body.checkbox);
 console.log("indide delete test"+req.body.listName);
 if (req.body.listName == "Today") {
     tasklist.deleteOne({ _id: req.body.checkbox }, function(err){
          if(err){
            console.log(err);
          }else {

              console.log("done!");
              res.redirect("/todo")
            }
      });
 }else {
   customList.findOneAndUpdate({listName: req.body.listName}, {$pull: {tasks: {_id:req.body.checkbox }}}, function(err,foundlist) {
      if (!err) {
        res.redirect("/"+req.body.listName);
      }

   });

 }

});

// app.get('/work', (req, res) => {
//
//   res.render("index", {Today:"Work-List", newtask:work});
//
// });


app.listen(8085, function() {

  console.log("server is working");
});

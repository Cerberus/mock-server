'use strict';

var express = require('express');
var app = express();

const db = require('./db')() // invoke db.

const { APP_PORT } = require('./config');
const Model = require('./models/endpoint.model.js');
const Group = require('./models/group.model.js');
const Log = require('./models/log.model.js');

var clonefn = function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)){ 
          copy[attr] = obj[attr];
        }
    }
    return copy;
}

var bodyParser = require('body-parser');

var nullJson = {  name   : '',
                  method : '',
                  url    : '',
                  json   : ''
               }
var check = function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


// var main = require('../public/index')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('views','./public')
app.set('view engine','jade')

app.use(express.static('./public'))

app.get('/', (req, res) => { //route to list all
  res.render('index')
})

app.get('/groupList', (req, res) => { //route to list all
  Group.find({}).populate('list').exec((err, groups) => {
      groups.forEach(function (group){//pretty json for quick view
        for(let list of group.list){
          if(list.type === 'json')
            list.response = JSON.stringify(JSON.parse(list.response),null, 2)
        }
      })
      if(err)
        return res.send('Error to show group list')
      res.render('group',{groups})
  })
})

app.get('/data', function(req, res) {
    Model.find({
    },
    function (err,models) {
      models.forEach(function (model){//pretty json for quick view
        if(model.type === 'json')
          model.response = JSON.stringify(JSON.parse(model.response),null, 2)
      })
      if(err)
        return res.json({})
      res.json(models)
    })
});

app.post('/ServiceList', function(req, res) {
    // console.log('req.body._id : ' + req.body._id);
    Model.find({},
    function (err,models) {
      models.forEach(function (model){//pretty json for quick view
        if(model.type === 'json')
          model.response = JSON.stringify(JSON.parse(model.response),null, 2)
      })
      if(err)
        return res.json({})
      res.json(models)
    })
});

app.get('/edit', (req, res) => { //route to edit file

  Model
  .findOne({name:req.query.name})
  .exec((err, result) => {
    if (err) return err;

    if (result) {

      let response = '';
      if(result.type === 'json')
        response = JSON.stringify(JSON.parse(result.response),null, '\t');
      else
        response = result.response
      return res.render('update',{
              _id     : result._id,
              name   : result.name,
              method : result.method,
              url    : result.url,
              type   : result.type,
              json   : response
            });
    } else {
      return res.render('update',nullJson);
    }

  });
})

app.get('/delete', (req, res) => { //route to add document
  // console.log('url : ' + req.query.url + ' method : ' + req.query.method);
  Model
  .remove({name:req.query.name}
  ,function (err, result){
     if (result) {
      console.log(result);
      return res.redirect('/')
    } else {
      return res.send('Fail to delete.');
    }
  });
})

app.post('/', (req, res) => { //route to add document

  if(req.body.type==='json'&&!check(req.body.response))
    return res.send('Detect wrong JSON format. Back to edit JSON')
  if(req.body.url.charAt(0)!='/')
    req.body.url = '/' + req.body.url
  req.body.list = []
  req.body.list.push("574e86119004f44f542fa8a4")

  Model
  .findOne({url: req.body.url, method: req.body.method}
  ,function (err, result) {
    if(!result)
    {
      var model = new Model(req.body);
      if(req.body.type === 'json')
        model.response = JSON.stringify(JSON.parse(req.body.response))
      model.save(function (err) {
      if(err)
        return res.send('Error to add, Duplicate name.')
      return res.redirect('/')
      })
    }
    else
      return res.send('Duplicate Method or url')
  })
})

app.post('/update', (req, res) => { //route to update document

  if(req.body.type==='json'&&!check(req.body.response))
    return res.send('Detect wrong JSON format. Back to edit JSON')
  if(req.body.type === 'json')
    req.body.response = JSON.stringify(JSON.parse(req.body.response))
  if(req.body.url.charAt(0)!='/')
    req.body.url = '/' + req.body.url
  Model
  .findOneAndUpdate({_id:req.body._id}
  ,req.body,
  function (err, result){
    if (result)
      return res.redirect('/')
    return res.send('Error to update, Duplicate name.')
    });
})

app.post('/test', (req, res) => { //show group list
  Group.findOneAndUpdate({_id:"57504c93dcfd00aa34c35310"},
    { $set : { list : ["57504d0cfb0632b6348f20a9","57505c73c6718dfa34b4b3a9"]} },
    function (err) {
      if(err)
        return res.send('fail')
      res.send('success to update')
    })
})
// groups.forEach(function (group){
//   group.list.push("57504d0cfb0632b6348f20a9")
// })

app.get('/callGroup', (req, res) => { //call add-edit group page
  Group
  .findOne({_id:req.query._id})
  .exec((err, result) => {
    if (err) return err;
    if (result) {
      return res.render('updateGroup',{
              _id     : result._id,
              name   : result.name,
              description : result.description,
              list : result.list
            });
    } else {
      return res.render('updateGroup',{name:"",list:""});
    }
  });
})

app.post('/modifyGroup', (req, res) => { //add-update group document
  
  var temp = req.body.list.split(',')
  req.body.list = []
  if(temp!=""){ //not null
    if(temp.length)
      temp.forEach(function (id){
        req.body.list.push(id)
      })
  }
  if(req.body._id=='undefined'){//new group
    var temp = {}
    temp.name = req.body.name
    temp.description = req.body.description
    temp.list = req.body.list
    var group = new Group(temp)
    group.save(function (err) {
      if(err)
        return res.send('Error to add group, may duplicate name.')
      return res.redirect('/groupList')
    })
  } else {//edit group
    Group
    .findOneAndUpdate({_id:req.body._id}
    ,req.body,
    function (err, result){
      if (result)
        return res.redirect('/groupList')
      return res.send('Error to update, may Duplicate name.')
      });
  }
})

// -------------log-------------
app.get('/log', function (req, res, next) {
    Log.find({}).exec(function (err, results) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.send(results)
      }
    })
});
// -------------reponse-------------
app.get('*', (req, res) => {
  const path = req.path;
  var logData = { methods : 'GET',path : req.path, IP : req.headers.host }
  var obj = new Log(logData)
    obj.save(function (err, obj) {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log(obj);
      }
    })
  Model
  .findOne({url: path, method: 'GET'})
  .exec((err, result) => {
    if (err) return err;
    if (result) {
      if(result.type==='json'){
        return res.json(JSON.parse(result.response));
      } else {
      res.set('Content-Type', 'application/xml');
      return res.send(result.response)
      }
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.post('*', (req, res) => {
  const path = req.path;
  var logData = { methods : 'POST',path : req.path, IP : req.headers.host }
  var obj = new Log(logData)
    obj.save(function (err, obj) {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log(obj);
      }
    })
  Model
  .findOne({url: path, method: 'POST'})
  .exec((err, result) => {
    if (err) return err;
    if (result) {
      if(result.type==='json'){
        return res.json(JSON.parse(result.response));
      } else {
      res.set('Content-Type', 'application/xml');
      return res.send(result.response)
      }
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.put('*', (req, res) => {
  const path = req.path;
  var logData = { methods : 'GET',path : req.path, IP : req.headers.host }
  var obj = new Log(logData)
    obj.save(function (err, obj) {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log(obj);
      }
    })
  Model
  .findOne({url: path, method: 'GET'})
  .exec((err, result) => {
    if (err) return err;
    if (result) {
      if(result.type==='json'){
        return res.json(JSON.parse(result.response));
      } else {
      res.set('Content-Type', 'application/xml');
      return res.send(result.response)
      }
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.delete('*', (req, res) => {
  var logData = { methods : 'GET',path : req.path, IP : req.headers.host }
  var obj = new Log(logData)
    obj.save(function (err, obj) {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log(obj);
      }
    })
  const path = req.path;
  Model
  .findOne({url: path, method: 'POST'})
  .exec((err, result) => {
    if (err) return err;
    if (result) {
      if(result.type==='json'){
        return res.json(JSON.parse(result.response));
      } else {
      res.set('Content-Type', 'application/xml');
      return res.send(result.response)
      }
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.listen(APP_PORT, function () {
  console.log(`App listening on port ${APP_PORT}!`);
});

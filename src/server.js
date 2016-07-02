'use strict';

var express = require('express');
var app = express();

const db = require('./db')() // invoke db.
const { APP_PORT } = require('./config');
const Model = require('./models/endpoint.model.js');
const Group = require('./models/group.model.js');
const Quicklink = require('./models/quicklink.model.js')
const Log = require('./models/log.model.js');
var Promise = require('bluebird');

var clonefn = function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
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

app.get('/__', (req, res) => { //route to list all
  return res.render('index')
})

app.get('/groupList', (req, res) => { //route to list all
  // console.log('/groupList');
  Group.find({}).populate('list').exec((err, groups) => {
      groups.forEach(function (group){//pretty json for quick view
        for(let list of group.list){
          if(list.type === 'json')
            list.response = JSON.stringify(JSON.parse(list.response),null, 2)
        }
      })
      if(err)
        return res.send('Error to show group list')
      return res.render('group',{groups})
  })
})


app.get('/data', function(req, res) {
    // console.log('/data');
    Model.find({
    }).lean().exec(
    function (err,models) {
        models.forEach(function (model){//pretty json for quick view
          if(model.type === 'json')
            model.response = JSON.stringify(JSON.parse(model.response),null, 2)

          Group.find({list:model._id},{name:true,_id:false}).lean().exec(function (err, belongGroup) {
            if(err)
              console.log('error to find group belong this model');
            model.belongGroup = [""]
            belongGroup.forEach(function(group) {
              model.belongGroup.push(group.name)
            })
              
          })
        });
      return setTimeout(function(){res.json(models)},300);
    })

});

app.get('/allGroup', function(req, res){
    // console.log('/allGroup');
    Group.find({},{name:true,_id:false}).lean().exec(function(err, groups) {
      // groups.forEach(function(group) {
      //   group.on = false
      // })
      return res.json(groups)
    })
})

app.get('/checkBoxGroup', function(req, res){
  var cbg = []
    Group.find({},{description:false}).lean().exec(function(err, groups) {
      groups.forEach(function(group) {
        let tempGroup = {_id:group._id,name:group.name}
        let tempList = group.list.map(function(item) {
          return item.toString();
        });
        if(req.query._id && tempList.indexOf(req.query._id) > -1)
          tempGroup.check = true
        else
          tempGroup.check = false
        cbg.push(tempGroup)
      })
      return res.json(cbg)
    })
})

app.post('/ServiceList', function(req, res) {
    // console.log('req.body._id : ' + req.body._id);
    // console.log('/ServiceList');
    Model.find({},
    function (err,models) {
      models.forEach(function (model){//pretty json for quick view
        if(model.type === 'json')
          model.response = JSON.stringify(JSON.parse(model.response),null, 2)
      })
      if(err)
        return res.json({})
      return res.json(models)
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
        response = JSON.stringify(JSON.parse(result.response),null, 2);
      else
        response = result.response
      return res.render('update',{
              _id    : result._id,
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

app.get('/delete', (req, res) => { //route to delete document

  Model
  .remove({_id:req.query._id}
  ,function (err, result){
     if (result) {
      Group.update({},
      { $pull : { list: req.query._id}},
      {multi:true}).exec(function (err,result){
        if(err)
          return res.send('Fail to clear id group.');
        return res.redirect('/__')
      })
    } else {
      return res.send('Fail to delete.');
    }
  });      
})

app.post('/', (req, res) => { //route to add document
  
  if(req.body.type==='json'&&!check(req.body.response))
    return res.json({"success":false,"message": 'Detect wrong JSON format'});
  if(req.body.url.charAt(0)!='/')
    req.body.url = '/' + req.body.url
  
  // req.body.group.forEach(function(groudId){
  //   console.log(groundId);
  // })
  Model
  .findOne({url: req.body.url, method: req.body.method}
  ,function (err, result) {
    if(!result)
    {
      var model = new Model(req.body);
      if(req.body.type === 'json')
        model.response = JSON.stringify(JSON.parse(req.body.response))
      model.save(function (err, model) {
      if(err)
        return res.json({"success":false,"message": 'Error to add\nDuplicate name'});
      var checkList = req.body.group.split(',')
      Group.find({},{_id:true}).exec(function(err, groups)
      {
        if(err)
          return res.json({"success":true,"message": 'This service has been added\nBut not belong any group'});
        groups.forEach(function(group){
          let id = group._id.toString()
          if(checkList.indexOf(id) > -1){
            Group.update({_id:id},{ $addToSet : { list: model._id}}).exec()
          } else {
            Group.update({_id:id},{ $pull : { list: model._id}}).exec()
          }
        })
      })
      return res.json({"success":true,"message": 'Add complete & ready to use.'});
      })
    }
    else
      return res.json({"success":false,"message": 'Error to add.\nDuplicate Method and url'});
  })
})

app.post('/update', (req, res) => { //route to update document
  if(req.body.type==='json'&&!check(req.body.response))
    return res.json({"success":false,"message": 'Detect wrong JSON format.'});
  if(req.body.type === 'json')
    req.body.response = JSON.stringify(JSON.parse(req.body.response))
  if(req.body.url.charAt(0)!='/')
    req.body.url = '/' + req.body.url
  Model
  .findOne({url: req.body.url, method: req.body.method}
  ,function (err, result) {
    if(err)
      return res.json({"success":false,"message": 'Error to update\nSomething went wrong'});
    else if(!result || (result._id == req.body._id))
    {
      Model
      .findOneAndUpdate({_id:req.body._id}
      ,req.body,
      function (err, model){
        if (err)
          return res.json({"success":false,"message": 'Error to update\nDuplicate name'});
        else
        {
          var checkList = req.body.group.split(',')
          console.log('checkList : ' + checkList);
          Group.find({},{_id:true}).exec(function(err, groups)
          {
            if(err)
              return res.json({"success":true,"message": 'This service has been updated\nBut not belong any group'});
            groups.forEach(function(group){
              let id = group._id.toString()
              console.log('checkList.indexOf(id) = ', checkList.indexOf(id));
              console.log('id : '+ id);
              if(checkList.indexOf(id) > -1){
                Group.update({_id:id},{ $addToSet : { list: model._id}}).exec()
              } else {
                Group.update({_id:id},{ $pull : { list: model._id}}).exec()
              }
            })
            // return res.redirect('/edit?name=' + req.body.name)
            return res.json({"success":true,"message": 'This service has been updated'});
          })
        }
      });
    }
    else
    {
      return res.json({"success":false,"message": 'Error to update\nDuplicate Method and url'});
    }
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
      return res.send('Error to update\nmay Duplicate name.')
      });
  }
})

app.get('/deleteGroup', (req, res) => { //route to delete Group
  Group
  .remove({_id:req.query._id}
  ,function (err, result){
     if (result) {
      return res.redirect('/groupList')
    } else {
      return res.send('Fail to delete.');
    }
  });
})

app.get('/AISapp', function (req, res) {
    Quicklink.find({}).exec(function (err, results) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.render('quicklink',{results})
      }
    })
});

app.get('/deleteAISapp', function (req, res) {
    Quicklink.remove({_id:req.query._id}).exec(function (err, results) {
      if (err) {
        res.status(500).send(err)
      } else {
        Quicklink.find({}).exec(function (err, results) {
          if (err) {
            res.status(500).send(err)
          } else {
            res.render('quicklink',{results})
          }
        })
      }
    })
});

app.post('/AISapp', function (req, res) {
    if(!(req.body.name&&req.body.link))
      return res.redirect('/AISapp')

    var quicklink = new Quicklink(req.body)
    quicklink.save(function(err){
      if(err)
        return res.status(500).send(err)
      Quicklink.find({}).exec(function (err, results) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.render('quicklink',{results})
        }
      })
    })
});

// -------------log-------------
app.get('/log', function (req, res) {
    Log.find({}).sort({'date': -1}).limit(50).exec(function (err, results) {
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

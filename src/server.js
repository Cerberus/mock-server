'use strict';

var express = require('express');
var app = express();

const db = require('./db')() // invoke db.

const { APP_PORT } = require('./config');
const Model = require('./models/endpoint.model.js');
const Group = require('./models/group.model.js');
const Log = require('./models/log.model.js');

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
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.set('views','./public')
app.set('view engine','jade')

app.use(express.static('./public'))

app.get('/', (req, res) => { //route to list all
  res.render('index')
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

app.get('/edit', (req, res) => { //route to edit file

  // console.log('edit');
  // console.log('url : ' + req.query.url + 'method : ' + req.query.method);
  Model
  .findOne({name:req.query.name})
  .exec((err, result) => {
    if (err) return err;

    if (result) {
      console.log('result.type : ' + result.type);
      let response = '';
      if(req.body.type === 'json')
        response = JSON.stringify(JSON.parse(result.response),null, '\t');
      else
        response = result.response
      return res.render('update',{
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
  Model
  .findOne({url: req.body.url, method: req.body.method}
  ,function (err, result) {
    if(!result)
    {
      var model = new Model(req.body);
      if(req.body.type === 'json')
        model.response = JSON.stringify(JSON.parse(req.body.response))
      model.save(function (err, result) {
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

  Model
  .findOneAndUpdate({name:req.body.name}
  ,req.body,
  function (err, result){
    if (result)
      return res.redirect('/')
    return res.send('Fail to update.')
    });
  })

// TODO: match with regex
//app.get('/service/mobile/:mobileNo')
// match /service/mobile/12345
// match /service/mobile/55555
// match /service/mobile/:mobileNo
app.get('/log', function (req, res, next) {
    Log.find({}).exec(function (err, results) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.send(results)
      }
    })
  });

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
      return res.json(JSON.parse(result.response));
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
      return res.json(JSON.parse(result.response));
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
      return res.json(JSON.parse(result.response));
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
      return res.json(JSON.parse(result.response));
    } else {
      res.status(404).send('Not found');
    }
  });
});



app.listen(APP_PORT, function () {
  console.log(`App listening on port ${APP_PORT}!`);
});

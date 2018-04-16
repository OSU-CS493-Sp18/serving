var logger = require('./lib/logger');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8000;

var lodgings = require('./lodgings');

app.use(bodyParser.json());

app.use(logger);

app.get('/', function (req, res, next) {
  res.status(200).send("Hello world!!\n");
});

app.get('/lodgings', function (req, res) {
  console.log("  -- req.query:", req.query);

  var page = parseInt(req.query.page) || 1;
  var numPerPage = 10;
  var lastPage = Math.ceil(lodgings.length / numPerPage);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;

  var start = (page - 1) * numPerPage;
  var end = start + numPerPage;
  var pageLodgings = lodgings.slice(start, end);

  var links = {};
  if (page < lastPage) {
    links.nextPage = '/lodgings?page=' + (page + 1);
    links.lastPage = '/lodgings?page=' + lastPage;
  }
  if (page > 1) {
    links.prevPage = '/lodgings?page=' + (page - 1);
    links.firstPage = '/lodgings?page=1';
  }

  res.status(200).json({
    lodgings: pageLodgings,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: numPerPage,
    totalCount: lodgings.length,
    links: links
  });
});

app.post('/lodgings', function (req, res, next) {
  console.log("  -- req.body:", req.body);
  if (req.body && req.body.name && req.body.price) {
    lodgings.push(req.body);
    var id = lodgings.length - 1;
    res.status(201).json({
      id: id,
      links: {
        lodging: '/lodgings/' + id
      }
    });
  } else {
    res.status(400).json({
      err: "Request needs a JSON body with a name and a price"
    });
  }
  // console.log(lodgings);
});

function verifyLodgingID(lodgingID) {
  return lodgingID && lodgingID >= 0 && lodgingID < lodgings.length || lodgingID === 0;
}

app.get('/lodgings/:lodgingID', function (req, res, next) {
  console.log("  -- req.params:", req.params);
  var lodgingID = parseInt(req.params.lodgingID);
  if (lodgings[lodgingID]) {
    res.status(200).json(lodgings[lodgingID]);
  } else {
    next();
  }
});

app.put('/lodgings/:lodgingID', function (req, res, next) {
  var lodgingID = parseInt(req.params.lodgingID);
  if (lodgings[lodgingID]) {
    if (req.body && req.body.name && req.body.price) {
      lodgings[lodgingID] = req.body;
      res.status(200).json({
        links: {
          lodging: '/lodgings/' + lodgingID
        }
      });
    } else {
      res.status(400).json({
        err: "Request needs a JSON body with a name and a price"
      });
    }
  } else {
    next();
  }
  // console.log(lodgings);
});

app.delete('/lodgings/:lodgingID', function (req, res, next) {
  console.log("  -- req.params:", req.params);
  var lodgingID = parseInt(req.params.lodgingID);
  if (lodgings[lodgingID]) {
    lodgings[lodgingID] = null;
    res.status(204).end();
  } else {
    next();
  }
  // console.log(lodgings);
});

app.use('*', function (req, res, next) {
  res.status(404).json({
    err: "Path " + req.url + " does not exist"
  });
});

app.listen(port, function() {
  console.log("== Server is running on port", port);
});

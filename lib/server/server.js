'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _sharedRoutes = require("../shared/routes");

var _sharedRoutes2 = _interopRequireDefault(_sharedRoutes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var express = require('express'),
    BodyParser = require('body-parser'),
    uurl = require('url'),
    irc = require('irc'),
    http = require('http'),
    socketio = require('socket.io'),
    config = require('../../config.json'),
    MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://192.168.1.100/imgbot", function (err, db) {
  var postsDb = db.collection('posts');

  var app = express();
  var httpServ = http.Server(app);
  var io = socketio(httpServ);

  app.set('views', './views');
  app.set('view engine', 'jade');

  app.use(express['static']('public'));
  app.use(BodyParser.urlencoded({ extended: true }));
  app.use(BodyParser.json());

  app.get('/posts', function (req, res) {

    postsDb.find({}).sort({ date: -1 }).limit(10).toArray(function (err, posts) {
      // remove mongo id
      posts = posts.map(function (p) {
        delete p._id;
        return p;
      });

      res.json(posts);
    });
  });

  app.get('/*', function (req, res) {
    _reactRouter2['default'].run(_sharedRoutes2['default'], req.url, function (Handler) {
      var content = _react2['default'].renderToString(_react2['default'].createElement(Handler, null));
      res.render('index', { content: content });
    });
  });

  var client = new irc.Client(config.irc.host, config.irc.nick, {
    channels: config.irc.channels
  });

  client.addListener('names', function (channel, nicks) {
    client.say(channel, "Hi! I'm Imgbot. Watch me on " + config.web.webAddress);
  });

  client.addListener('message', function (from, to, message) {
    var url = message.trim();

    var media = {};

    if (url.toLowerCase().match(/.jpe?g|png|gif$/)) {
      media = { type: "image", url: url };
    }

    if (url.toLowerCase().match(/.webm$/)) {
      media = { type: "webm", url: url };
    }

    if (url.match("^(https?:\/\/)?(www.)?youtube")) {
      var yt = uurl.parse(url, true);
      var vid = yt.query.v;

      media = { type: "youtube", vid: vid, url: url };
    }

    var response = {
      media: media,
      nick: from,
      channel: to,
      date: new Date().getTime()
    };

    io.emit("post", response);

    postsDb.insert(response);
  });

  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

  httpServ.listen(config.web.port, function () {
    console.log('listening on *:3000');
  });
});
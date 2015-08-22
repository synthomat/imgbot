"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var r = _requestPromise2["default"].defaults({
  json: true
});

var Header = (function (_React$Component) {
  _inherits(Header, _React$Component);

  function Header() {
    _classCallCheck(this, Header);

    _get(Object.getPrototypeOf(Header.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Header, [{
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        "div",
        null,
        _react2["default"].createElement(
          "h1",
          null,
          "ImgBot"
        )
      );
    }
  }]);

  return Header;
})(_react2["default"].Component);

var ImageWidget = (function (_React$Component2) {
  _inherits(ImageWidget, _React$Component2);

  function ImageWidget() {
    _classCallCheck(this, ImageWidget);

    _get(Object.getPrototypeOf(ImageWidget.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ImageWidget, [{
    key: "render",
    value: function render() {
      var post = this.props.post.media;
      return _react2["default"].createElement("img", { src: post.url });
    }
  }]);

  return ImageWidget;
})(_react2["default"].Component);

var YouTubeWidget = (function (_React$Component3) {
  _inherits(YouTubeWidget, _React$Component3);

  function YouTubeWidget() {
    _classCallCheck(this, YouTubeWidget);

    _get(Object.getPrototypeOf(YouTubeWidget.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(YouTubeWidget, [{
    key: "render",
    value: function render() {
      var post = this.props.post.media;
      return _react2["default"].createElement("iframe", { src: "https://www.youtube.com/embed/" + post.vid });
    }
  }]);

  return YouTubeWidget;
})(_react2["default"].Component);

var WebMWidget = (function (_React$Component4) {
  _inherits(WebMWidget, _React$Component4);

  function WebMWidget() {
    _classCallCheck(this, WebMWidget);

    _get(Object.getPrototypeOf(WebMWidget.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(WebMWidget, [{
    key: "render",
    value: function render() {
      var post = this.props.post.media;
      return _react2["default"].createElement("video", { src: post.url, controls: true });
    }
  }]);

  return WebMWidget;
})(_react2["default"].Component);

var AppHandler = (function (_React$Component5) {
  _inherits(AppHandler, _React$Component5);

  function AppHandler(props) {
    _classCallCheck(this, AppHandler);

    _get(Object.getPrototypeOf(AppHandler.prototype), "constructor", this).call(this, props);

    this.state = {
      posts: [],

      notify: true
    };

    if (typeof window !== "undefined") {
      this.sound = new Audio("/notify.mp3");
    }
  }

  _createClass(AppHandler, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this = this;

      this.socket = io.connect();

      var location = window.location;

      r.get(location.origin + "/posts", function (err, response, body) {
        _this.setState({ posts: body });
      });

      this.socket.on('post', function (post) {
        var posts = _this.state.posts;

        posts.unshift(post);

        _this.setState({ posts: posts });

        if (typeof window !== "undefined" && _this.state.notify) {
          _this.sound.play();
        }
      });
    }
  }, {
    key: "getWidget",
    value: function getWidget(post) {
      switch (post.media.type) {
        case 'image':
          return _react2["default"].createElement(ImageWidget, { post: post });

        case 'youtube':
          return _react2["default"].createElement(YouTubeWidget, { post: post });

        case 'webm':
          return _react2["default"].createElement(WebMWidget, { post: post });
      }
    }
  }, {
    key: "createPost",
    value: function createPost(post) {
      return _react2["default"].createElement(
        "li",
        null,
        _react2["default"].createElement(
          "div",
          null,
          this.getWidget(post)
        ),
        _react2["default"].createElement(
          "div",
          { className: "foot" },
          "from ",
          post.nick,
          " in ",
          post.channel,
          _react2["default"].createElement(
            "a",
            { style: { float: "right" }, target: "_blank", href: post.url },
            "original"
          )
        )
      );
    }
  }, {
    key: "toggleNotification",
    value: function toggleNotification() {
      this.setState({ notify: !this.state.notify });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react2["default"].createElement(
        "div",
        null,
        _react2["default"].createElement(Header, null),
        _react2["default"].createElement(
          "label",
          null,
          _react2["default"].createElement("input", {
            type: "checkbox",
            checked: this.state.notify,
            onChange: function (x) {
              return _this2.toggleNotification();
            }
          }),
          !this.state.notify ? "don't" : '',
          " play sound"
        ),
        _react2["default"].createElement(
          "ul",
          { className: "posts" },
          this.state.posts.map(function (p) {
            return _this2.createPost(p);
          })
        )
      );
    }
  }]);

  return AppHandler;
})(_react2["default"].Component);

exports["default"] = AppHandler;
module.exports = exports["default"];
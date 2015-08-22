import React from "react";
import request from 'request-promise';
var r = request.defaults({
  json: true
});

class Header extends React.Component {
  render() {
    return (
      <div><h1>ImgBot</h1></div>
    );
  }
}

class ImageWidget extends React.Component {
  render() {
    let post = this.props.post.media;
    return (<img src={ post.url } />);
  }
}

class YouTubeWidget extends React.Component {
  render() {
    let post = this.props.post.media;
    return (<iframe src={ `https://www.youtube.com/embed/${post.vid}` } />);
  }
}

class WebMWidget extends React.Component {
  render() {
    let post = this.props.post.media;
    return (<video src={ post.url } controls />);
  }
}


export default class AppHandler extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],

      notify: true
    };

    if (typeof window !== "undefined") {
      this.sound = new Audio("/notify.mp3");
    }
  }

  componentDidMount() {
    this.socket = io.connect();

    let location = window.location;


    r.get(`${location.origin}/posts`, (err, response, body) => {
      this.setState({posts: body});
    });

    this.socket.on('post', (post) => {
      var posts = this.state.posts;

      posts.unshift(post);

      this.setState({posts: posts});

      if (typeof window !== "undefined" && this.state.notify) {
        this.sound.play();
      }
    });
  }


  getWidget(post) {
    switch (post.media.type) {
      case 'image':
        return (<ImageWidget post={ post } />);

      case 'youtube':
        return (<YouTubeWidget post={ post } />);

      case 'webm':
        return (<WebMWidget post={ post } />);
    }
  }

  createPost(post) {
    return (
      <li>
        <div>{this.getWidget(post)}</div>
        <div className="foot">from { post.nick } in { post.channel }<a style={{float: "right"}} target="_blank" href={ post.media.url } >original</a></div>
      </li>
    );
  }

  toggleNotification() {
    this.setState({notify: !this.state.notify});
  }

  render() {
    return (
      <div>
        <Header />

        <label>
          <input
            type="checkbox"
            checked={ this.state.notify }
            onChange={ x => this.toggleNotification() }
          />

          { !this.state.notify ? "don't" : ''} play sound
        </label>

        <ul className="posts">
          { this.state.posts.map(p => this.createPost(p)) }
        </ul>
      </div>
    );
  }
}

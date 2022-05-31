
import React from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/'
})


export default class PostList extends React.Component {
 state = {
  posts: []
}

componentDidMount() {
  api.get('/user').then(res => {
    const posts = res.data;
    this.setState({ posts });
   })
}

render() {
  return (
   <ul>
    { /* this.state.posts.map(post => <li>{post.name}</li>) */}
   </ul>
  )
 }
}

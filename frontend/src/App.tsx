import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

interface NameProps { 
  name?: string;
}

interface NameState {
  date: Date,
  username: string
}

class App extends React.Component<NameProps, NameState> {
  timerID?: ReturnType<typeof setInterval>;
  constructor(props: NameProps){
    super(props);
    this.state = {date: new Date(), username: ""}
    this.getUser = this.getUser.bind(this);
  }

  componentDidMount(): void {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
  }

  tick(): void {
    this.setState({
      date: new Date()
    })
  }

  componentWillUnmount(): void {
      clearInterval(this.timerID);
  }

  render(): React.ReactNode {
      return (
        <div>
          <h1>Your username is {this.state.username}</h1>
          <button onClick={this.getUser}>Test</button>
        </div>
      )
  }
  getUser(): void {
    axios.get('http://localhost:3500/user/get/2').then(response => {
      console.log(response.data.username);
      const username: string = response.data.username;
      this.setState({
        username: username
      });
    }).catch((error)=>{
      console.log(error);
    })
  }
}
export default App;

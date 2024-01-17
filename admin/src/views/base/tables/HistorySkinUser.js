import React, { Component } from 'react';

import 'moment-timezone';
import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';
let headers = new Headers();
const auth = localStorage.getItem('auth');
headers.append('Authorization', 'Bearer ' + auth);
headers.append('Content-Type', 'application/json');
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    if(this.props.data.dataSeeder == undefined){
      this.props.history.push('/users')
    }
  }

  render() {

    return (
      <div className="animated fadeIn">

      </div>
    );

  }
}

const mapStateToProps = state => {
  return {
    data: state.getData_AllAPI
  }
}

export default connect(mapStateToProps, {})(Users);

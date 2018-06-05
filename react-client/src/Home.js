import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { Button, Container } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

export default withAuth(class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {authenticated: null, userinfo: null, isOpen: false};
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      if (authenticated && !this.state.userinfo) {
        const userinfo = await this.props.auth.getUser();
        this.setState({authenticated, userinfo});
      } else {
        this.setState({authenticated});
      }
    }
  }

  async componentDidMount() {
    this.checkAuthentication();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async login() {
    this.props.auth.login('/');
  }

  async logout() {
    this.props.auth.logout('/');
    this.setState({authenticated: null, userinfo: null});
  }

  render() {
    if (this.state.authenticated === null) return null;
    const button = this.state.authenticated ?
      <div>
        <Button color="link"><Link to="/points">Manage Points</Link></Button><br/>
        <Button color="link" onClick={this.logout}>Logout</Button>
      </div>:
      <Button color="primary" onClick={this.login}>Login</Button>;

    const message = this.state.userinfo ?
      <p>Hello, {this.state.userinfo.given_name}!</p> :
      <p>Please log in to manage your points.</p>;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          {message}
          {button}
        </Container>
      </div>
    );
  }
});
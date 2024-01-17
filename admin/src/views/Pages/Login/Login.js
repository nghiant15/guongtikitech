import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, InputGroup, Row } from 'reactstrap';
import validateInput from '../../../shared/validations/login';
import TextFieldGroup from '../../Common/TextFieldGroup';
import axios from 'axios'
import jwt from 'jsonwebtoken'
import Constants from "./../../../contants/contants";
import md5 from "md5";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: {},
      isLoading: false
    }
    localStorage.removeItem('auth');
    if (this.props.location.pathname === '/logout') window.location.href = '#/login';
  }
  isValid() {
    const { errors, isValid } = validateInput(this.state);

    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }
  async onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      const res = await axios({
        baseURL: Constants.BASE_URL,
        url: Constants.LOGIN_ADMIN,
        method: 'POST',
        data: {
          username: this.state.username,
          password: md5(this.state.password)
        }
      });

      if(res.data.is_success){
        var token = jwt.decode(res.data.data.token);
        localStorage.setItem('user', JSON.stringify({ username: this.state.username,
          password: this.state.password, company_id: res.data.data.data.Company_Id, sale_id: res.data.data.data._id }));
        localStorage.setItem('auth', 'abv');
        localStorage.setItem('company_id', token.company_id);
        localStorage.setItem('role', token.role);
        localStorage.setItem('token', res.data.data.token);

        this.props.history.push('/dashboard')
      } else {
        console.log(this.state.username)
        console.log(this.state.password)
        this.setState({ isLoading: false, errors: { common: 'Username or password is incorrect' } });
      }
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { errors, username, password, isLoading } = this.state;
    return (
      <div className="app flex-row align-items-center mt-5">
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <form onSubmit={async e => await this.onSubmit(e)}>
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <h1>Đăng nhập</h1>
                      <span className="error">{errors.common}</span>
                      <InputGroup className="mb-3">
                        <TextFieldGroup
                          field="username"
                          label="Tên đăng nhập"
                          value={username}
                          error={errors.username}
                          placeholder={"Tên đăng nhập"}
                          onChange={e => this.onChange(e)}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <TextFieldGroup
                          type="password"
                          field="password"
                          label="Mật khẩu"
                          value={password}
                          placeholder={"Mật khẩu"}
                          error={errors.password}
                          onChange={e => this.onChange(e)}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" disabled={isLoading}>Đăng nhập</Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </CardGroup>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default Login;

import React, { Component } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table, Button, Input,
  ModalHeader, ModalBody, ModalFooter, Modal,
  Alert
} from 'reactstrap';
import 'moment-timezone';
import Constants from "./../../../contants/contants";
import TextFieldGroup from "../../../views/Common/TextFieldGroup";
import axios from 'axios'
let headers = new Headers();
const auth = localStorage.getItem('auth');
headers.append('Authorization', 'Bearer ' + auth);
headers.append('Content-Type', 'application/json');
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      key: '',

      page: 1,
      itemsCount: 0,
      limit: 20,
      totalActive: 0,
      modalCom: false,


      updated: '',
      dataApi: [],
      action: 'new',
      Name: '',
      Status: '',
      modalDelete: false,
      delete: null,
      arrPagination: [],
      indexPage: 0,
      token: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    };
  }
  async componentDidMount() {
    this.getData()
  }

  pagination(dataApi) {
    var i, j, temparray, chunk = 5;
    var arrTotal = [];
    for (i = 0, j = dataApi.length; i < j; i += chunk) {
      temparray = dataApi.slice(i, i + chunk);
      arrTotal.push(temparray);
    }
    this.setState({ arrPagination: arrTotal, data: arrTotal[this.state.indexPage] });
  }

  getData = async () => {
    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_ROLE,
      method: 'GET',
      headers: this.state.token
    });

    this.pagination(res.data.data);
    this.setState({ dataApi: res.data.data });

    let active = 0

    res.data.data.map(val => {
      if (val.Status == "Actived") {
        active = active + 1
      }
    })

    this.setState({ isLoading: false, totalActive: active });
  }

  searchKey(key) {
    this.setState({ key: key })

    if (key != '') {
      let d = []
      this.state.dataApi.map(val => {
        if (val.Name.toLocaleUpperCase().includes(key.toLocaleUpperCase())) {
          d.push(val)
        }
      })
      let active = 0

      d.map(val => {
        if (val.Status == "Actived") {
          active = active + 1
        }
      })

      this.setState({ data: d, totalActive: active })
    } else {
      let active = 0

      this.state.dataApi.map(val => {
        if (val.Status == "Actived") {
          active = active + 1
        }
      })

      this.setState({ data: this.state.dataApi, totalActive: active })
    }
  }

  async toggleModal(key) {
    if (key == 'new') {
      this.setState({
        modalCom: !this.state.modalCom,
        action: key,
        Name: ''
      })
    }
  }

  onChange(key, val) {
    this.setState({ [key]: val })
  }

  async addRoles() {
    const { Name } = this.state

    if (Name == null || Name == '') {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return
    }

    const body = {
      Name: Name
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.ADD_ROLE,
      method: 'PUT',
      data: body
    });

    if (res.data.is_success == true) {
      this.getData();
      this.setState({ modalCom: !this.state.modalCom })
    } else {
      alert(res.data.message);
      this.setState({ isLoading: false });
    }
  }

  async openUpdate(item) {
    this.setState({
      modalCom: !this.state.modalCom,
      action: "update",
      Name: item.Name,
      id: item['_id'],
      Status: item.Status
    })
  }

  async updateUser() {
    const { Name, Status } = this.state

    if (Name == null || Name == '') {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return
    }

    const body = {
      Name: Name,
      id: this.state.id,
      Status: Status
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.UPDATE_ROLE,
      method: 'POST',
      data: body
    });

    if (res.data.is_success == true) {
      this.getData();
      this.setState({ modalCom: !this.state.modalCom })
    } else {
      alert(res.data.message);
      this.setState({ isLoading: false });
    }
  }

  openDelete = (item) => {
    this.setState({
      modalDelete: !this.state.modalDelete,
      delete: item
    })
  }

  async delete() {
    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.DELETE_ROLE,
      method: 'DELETE',
      data: {
        "id": this.state.delete['_id']
      }
    });

    if (res.data.is_success == true) {
      this.getData();
      this.setState({ modalDelete: !this.state.modalDelete, delete: null })
    } else {
      alert(res.data.message);
      this.setState({ isLoading: false });
    }

  }

  getUsers(page = 1) {
    const limit = this.state.limit;
    const key = this.state.key || '';
    const fetchData = {
      method: 'GET',
      headers: headers
    };
    fetch(global.BASE_URL + '/admin/users?key=' + key + '&page=' + page + '&limit=' + limit, fetchData).then(users => {
      users.json().then(result => {
        this.setState({
          data: result.data,
          itemsCount: result.total,
          activePage: page,
          totalActive: result.totalActive,
          updated: '',
        });
      })
    }).catch(console.log);
  }

  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  goSearch() {
    this.getUsers();
  }

  render() {
    const { data, key, viewingUser, communities, dataCompany,
      currentCompany, dataSale, currentSale, action, arrPagination, indexPage } = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <p style={styles.success}>{this.state.updated}</p>
            <p style={styles.danger}>{this.state.deleted}</p>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> ROLE (Total: {this.state.data != undefined || this.state.data != null ?
                  this.state.data.length : 0}, Active: {this.state.totalActive}, Page: {this.state.indexPage + 1}))
                <div style={styles.tags}>
                  <div>
                    <Input style={styles.searchInput} onChange={(e) => this.searchKey(e.target.value)} name="key" value={key} placeholder="Search" />
                    <Button outline color="primary" style={styles.floatRight} size="sm" onClick={async e => await this.toggleModal("new")}>Add</Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th style={styles.wa10}>No.</th>
                      <th style={styles.wh25}>Name</th>
                      <th style={styles.wh25}>Status</th>
                      <th style={styles.wh25}>Create Date</th>
                      <th style={styles.w5}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data != undefined ?
                        data.map((item, i) => {
                          return (
                            <tr key={i} style={styles.row}>
                              <td style={styles.wa10}>{i + 1}</td>
                              <td style={styles.wh25}>{item.Name}</td>
                              <td style={styles.wh25}>{item.Status}</td>
                              <td style={styles.wh25}>{item.Create_Date}</td>
                              <td style={styles.w5}>
                                <Button style={styles.mgl5} outline color="primary" size="sm" onClick={async (e) => await this.openUpdate(item)} >Cập nhật</Button>{' '}
                                <Button outline color="danger" size="sm" onClick={(e) => { this.openDelete(item) }}>Xoá</Button>
                              </td>
                            </tr>
                          );
                        }) : ""
                    }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            {
              arrPagination.length == 1 ? "" :
                <div style={{ float: 'right', marginRight: '10px', padding: '10px' }}>
                  <tr style={styles.row}>
                    {
                      arrPagination.map((item, i) => {
                        return (
                          <td>
                            <Button style={styles.pagination} color={i == indexPage ? 'primary' : 'danger'} onClick={e => { this.setState({ data: arrPagination[i], indexPage: i }) }}>{i + 1}</Button>
                          </td>
                        );
                      })
                    }
                  </tr>
                </div>
            }
          </Col>
        </Row>

        <Modal isOpen={this.state.modalCom} className={this.props.className}>
          <ModalHeader>{this.state.action == 'new' ? `Tạo mới` : `Cập nhật`}</ModalHeader>
          <ModalBody>
            <TextFieldGroup
              field="Name"
              label="Name"
              value={this.state.Name}
              placeholder={"Name"}
              // error={errors.title}
              onChange={e => this.onChange("Name", e.target.value)}
            // rows="5"
            />
            {
              action == 'new' ? "" : <div>
                <label style={styles.flexLabel} htmlFor="tag">Status:</label>
                <select style={styles.flexOption} name="Status" onChange={e => this.onChange("Status", e.target.value)}>
                  <option value={this.state.Status}>{this.state.Status == '' ? ` - - - - - - - - - - ` : this.state.Status}</option>
                  <option value={'Actived'}>Actived</option>
                  <option value={'Locked'}>Locked</option>
                  <option value={'Deactived'}>Deactived</option>
                </select>
              </div>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => { this.state.action === 'new' ? this.addRoles() : this.updateUser() }} disabled={this.state.isLoading}>Lưu</Button>{' '}
            <Button color="secondary" onClick={e => this.toggleModal("new")}>Đóng</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalDelete} toggle={e => this.setState({ modalDelete: !this.state.modalDelete, delete: null })} className={this.props.className}>
          <ModalHeader toggle={e => this.setState({ modalDelete: !this.state.modalDelete, delete: null })}>{`Xoá`}</ModalHeader>
          <ModalBody>
            <label htmlFor="tag">{`Xác nhận xoá !!! "${this.state.delete ? this.state.delete.Email : ''}" ?`}</label>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => this.delete()} disabled={this.state.isLoading}>Xoá</Button>{' '}
            <Button color="secondary" onClick={e => this.setState({ modalDelete: !this.state.modalDelete, delete: null })}>Đóng</Button>
          </ModalFooter>
        </Modal>
      </div>
    );

  }
}

const styles = {
  pagination: {
    marginRight: '5px'
  },
  flexLabel: {
    width: 100
  },
  flexOption: {
    width: 300
  },
  a: {
    textDecoration: 'none'
  },
  floatRight: {
    float: "right",
    marginTop: '3px'
  },
  spinner: {
    width: "30px"
  },
  center: {
    textAlign: "center"
  },
  tbody: {
    height: "380px",
    overflowY: "auto"
  },
  wh25: {
    width: "25%",
    float: "left",
    height: "80px"
  },
  w5: {
    width: "15%",
    float: "left",
    height: "80px"
  },
  wa10: {
    width: "5%",
    float: "left",
    height: "80px"
  },
  row: {
    float: "left",
    width: "100%"
  },
  success: {
    color: 'green'
  },
  danger: {
    color: 'red'
  },
  mgl5: {
    marginLeft: '5px'
  },
  tags: {
    float: "right",
    marginRight: "5px",
    width: "250px"
  },
  searchInput: {
    width: "190px",
    display: 'inline-block',
  },
  userActive: {
    color: 'green'
  },
  userPending: {
    color: 'red'
  },
  nagemonNameCol: {
    width: '328px'
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '99999px'
  },
  mgl5: {
    marginBottom: '0px'
  }
}

export default Users;

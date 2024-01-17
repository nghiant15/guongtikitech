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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Constants from "./../../../contants/contants";
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
      Sale_Id: '',
      Package_Id: '',
      End_Date: new Date(),
      Status: '',
      modalDelete: false,
      delete: null,
      dataSale: [],
      dataSaleOfCompany: [],
      currentSale: '',
      currentSaleOfCompany: '',
      arrPagination: [],
      indexPage: 0,
      company_id: localStorage.getItem('user'),
      token: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      isUpdate: false
    };
  }
  async componentDidMount() {
    this.getData()
    this.getAllSaleOfCompany()
  }

  pagination(dataApi) {
    var i, j, temparray, chunk = 5;
    var arrTotal = [];
    for (i = 0, j = dataApi.length; i < j; i += chunk) {
      temparray = dataApi.slice(i, i + chunk);
      arrTotal.push(temparray);
    }
    if (arrTotal.length != 0) {
      this.setState({ arrPagination: arrTotal, data: arrTotal[this.state.indexPage] });
    } else {
      this.setState({ arrPagination: arrTotal, data: [] });
    }

  }

  getData = async () => {
    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_SALELOG,
      method: 'GET',
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

  }

  async toggleModal(key) {
    const { Sale_Id, End_Date } = this.state
    this.setState({ isUpdate: true })
    await this.getSaleData()
    await this.getAllSaleOfCompany()
    if (key == 'new') {
      this.setState({
        modalCom: !this.state.modalCom,
        action: key,
        End_Date: End_Date,
        Sale_Id: ''
      })
    }
  }

  onChange(key, val) {
    this.setState({ [key]: val })
  }

  async addUser() {
    const { Sale_Id, End_Date, Package_Id } = this.state

    const body = {
      End_Date: End_Date,
      Sale_Id: Sale_Id,
      Package_Id: Package_Id
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.ADD_SALELOG,
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
    this.setState({ isUpdate: false, currentSaleOfCompany: item._id })
    await this.getSaleData(item.Package_Id)

    this.setState({
      modalCom: !this.state.modalCom,
      action: "update",
      Sale_Id: item.Sale_Id,
      End_Date: item.End_Date,
      Package_Id: item.Package_Id,
      id: item['_id'],
      Status: item.Status
    })
  }

  async updateUser() {
    this.setState({ isUpdate: true })
    const { End_Date, Sale_Id, Status, Package_Id, currentSaleOfCompany } = this.state

    const body = {
      End_Date: End_Date,
      Sale_Id: currentSaleOfCompany,
      id: this.state.id,
      Status: Status,
      Package_Id: Package_Id
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.UPDATE_SALELOG,
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
      url: Constants.DELETE_SALELOG,
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

  async getSaleData(id) {
    const resSale = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_SALE,
      method: 'GET',
    });

    if (id != '' || id != undefined) {
      const currentSale = await axios({
        baseURL: Constants.BASE_URL,
        url: Constants.LIST_SALE_WITH_ID + id,
        method: 'GET',
      });
      if (currentSale.data.data != null || currentSale.data.data != undefined) {
        this.setState({ currentSale: currentSale.data.data.Name });
      }
    }
    this.setState({ dataSale: resSale.data.data });
  }

  async getAllSaleOfCompany() {

    const { company_id } = this.state;
    const id = JSON.parse(company_id);

    var bodyCustomer = {
      company_id: id.company_id
    }

    const resAllSale = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.GET_SALE,
      method: 'POST',
      data: bodyCustomer,
      headers: this.state.token
    })

    this.setState({ dataSaleOfCompany: resAllSale.data.data });
  }

  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { data, key, viewingUser, communities, dataSaleOfCompany,
      currentSaleOfCompany, dataSale, currentSale, action,
      arrPagination, indexPage, End_Date, isUpdate } = this.state;
    if (!this.state.isLoading) {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <p style={styles.success}>{this.state.updated}</p>
              <p style={styles.danger}>{this.state.deleted}</p>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> PAKAGE SALE LOG (Total: {this.state.data != undefined || this.state.data != null ?
                    this.state.data.length : 0}, Active: {this.state.totalActive}, Page: {this.state.indexPage + 1})
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
                        <th style={styles.wh25}>Sale ID</th>
                        <th style={styles.wh25}>Package ID</th>
                        <th style={styles.wh25}>End Date</th>
                        <th style={styles.wh25}>Status</th>
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
                                <td style={styles.wh25}>{item.Sale_Id}</td>
                                <td style={styles.wh25}>{item.Package_Id}</td>
                                <td style={styles.wh25}>
                                  {(new Date(item.End_Date)).toLocaleDateString() + ' ' + (new Date(item.End_Date)).toLocaleTimeString()}
                                </td>
                                <td style={styles.wh25}>{item.Status}</td>
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
              <div style={styles.datePicker}>
                <label>End Date:  </label> {' '}
                <DatePicker selected={new Date(End_Date)} onChange={(date) => this.setState({ End_Date: date })} />
              </div>

              {
                action == 'new' ? "" : <div>
                  <label style={styles.flexLabel} htmlFor="tag">Status    </label>
                  <select style={styles.flexOption} name="Status" onChange={e => this.onChange("Status", e.target.value)}>
                    <option value={this.state.Status}>{this.state.Status == '' ? ` - - - - - - - - - - ` : this.state.Status}</option>
                    <option value={'Actived'}>Actived</option>
                    <option value={'Locked'}>Locked</option>
                    <option value={'Deactived'}>Deactived</option>
                  </select>
                </div>
              }

              <div>
                <label style={styles.flexLabel} htmlFor="tag">Package:    </label>
                <select style={styles.flexOption} name="Package_Id" onChange={e => this.onChange("Package_Id", e.target.value)}>
                  <option value={this.state.Package_Id}>-----</option>
                  {
                    dataSale.map((item, i) => {
                      if (item.Name == currentSale) {
                        return (
                          <option selected value={item._id}>{item.Name}</option>
                        );
                      } else {
                        return (
                          <option value={item._id}>{item.Name}</option>
                        );
                      }
                    })
                  }
                </select>
              </div>
              {
                isUpdate ? <div>
                  <label style={styles.flexLabel} htmlFor="tag">Sale:    </label>
                  <select style={styles.flexOption} name="Sale_Id" onChange={e => this.onChange("Sale_Id", e.target.value)}>
                    <option value={this.state.Sale_Id}>-----</option>
                    {
                      dataSaleOfCompany.map((item, i) => {
                        return (
                          <option value={item._id}>{item.Name}</option>
                        );
                      })
                    }
                  </select>
                </div> : ""

              }

            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={e => { this.state.action === 'new' ? this.addUser() : this.updateUser() }} disabled={this.state.isLoading}>Lưu</Button>{' '}
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
    return (
      <div id="page-loading">
        <div className="three-balls">
          <div className="ball ball1"></div>
          <div className="ball ball2"></div>
          <div className="ball ball3"></div>
        </div>
      </div>
    );
  }
}

const styles = {
  datePicker: {
    marginBottom: 20
  },
  wa10: {
    width: "5%",
    float: "left",
    height: "80px"
  },
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
    width: "19%",
    float: "left",
    height: "80px"
  },
  wh15: {
    width: "15%",
    float: "left",
    height: "80px"
  },
  w5: {
    width: "15%",
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

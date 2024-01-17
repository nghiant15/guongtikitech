import React, { Component } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button, Input,
  ModalHeader, ModalBody, ModalFooter, Modal,
} from 'reactstrap';

import {
  CBadge,
  CRow,
  CCol,
  CSelect
} from '@coreui/react'

import 'moment-timezone';
import "react-datepicker/dist/react-datepicker.css";
import Constants from "./../../../contants/contants";
import axios from 'axios'
import { css } from "@emotion/react";
import Pagination from '@material-ui/lab/Pagination';
import DotLoader from "react-spinners/DotLoader";
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
      keyName: '',
      keyCodeCompany: '',
      keyTypeKey: '',
      keyActive: '',
      keyEndDate: '',
      keyStatus: '',
      keyValue: '',

      page: 1,
      itemsCount: 0,
      limit: 20,
      totalActive: 0,
      modalCom: false,


      updated: '',
      dataApi: [],
      action: 'new',
      Name: '',
      Company_Id: '',
      Type_Key: '',
      Start_Date: new Date(),
      End_Date: new Date(),
      Status: '',
      Value: '',
      modalDelete: false,
      delete: null,
      dataCompany: [],
      currentCompany: '',
      dataTypeKey: [],
      currentTypeKey: '',
      dataHardWare: [],
      currentHardWare: '',
      arrPagination: [],
      indexPage: 0,
      hidden: true,
      token: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
  }
  async componentDidMount() {
    this.getData();
    await this.getHardWData_all();

    let arr = JSON.parse(localStorage.getItem('url'));
    for (let i = 0; i < arr.length; i++) {
      if ("#" + arr[i].to == window.location.hash) {
        if (arr[i].hidden == true) {
          window.location.href = '#/'
        }
      }
    }
  }

  pagination(dataApi) {
    var i, j, temparray, chunk = 5;
    var arrTotal = [];
    for (i = 0, j = dataApi.length; i < j; i += chunk) {
      temparray = dataApi.slice(i, i + chunk);
      arrTotal.push(temparray);
    }
    if (arrTotal.length == 0) {
      this.setState({
        hidden: false
      })
    } else {
      this.setState({
        hidden: true
      })
    }
    this.setState({ arrPagination: arrTotal, data: arrTotal[this.state.indexPage] });
  }

  getBadge(status) {
    switch (status) {
      case 'INSTOCK': return 'success'
      case 'DISABLE': return 'danger'
      default: return 'primary'
    }
  }

  async getHardWData_all() {
    const resKey = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_HARDWARE,
      method: 'POST',
      headers: this.state.token
    });

    this.setState({ dataHardWare: resKey.data.data });
  }

  async getHardWData(id) {
    const resKey = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_HARDWARE,
      method: 'POST',
      data: {
        condition: {
          "Status": "INSTOCK"
        }
      },
      headers: this.state.token
    });

    if (id != '' || id != undefined) {
      const currentKey = await axios({
        baseURL: Constants.BASE_URL,
        url: Constants.LIST_HARDWARE_WITH_ID + id,
        method: 'POST',
        headers: this.state.token
      });
      if (currentKey.data.data != null || currentKey.data.data != undefined) {
        this.setState({ currentHardWare: currentKey.data.data.Name });
      }
    }

    this.setState({ dataHardWare: resKey.data.data });
  }

  getData = async () => {
    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_KEY,
      method: 'POST',
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

  searchKey() {
    const { indexPage, key, keyStatus } = this.state;

    if (key != '' || keyStatus != '') {
      let d = []
      this.state.dataApi.map(val => {
        if ((val.Name.toLocaleUpperCase().includes(key.toLocaleUpperCase()) ||
          val.Value.toLocaleUpperCase().includes(key.toLocaleUpperCase())) &&
          val.Status.toLocaleUpperCase().includes(keyStatus.toLocaleUpperCase())) {
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

      this.setState({ data: this.state.arrPagination[indexPage], totalActive: active })
    }
  }

  actionSearch(e, name_action) {
    this.setState({
      [name_action]: e.target.value
    }, () => {
      this.searchKey();
    });
  }

  resetSearch() {
    this.setState({
      key: '',
      keyStatus: ''
    }, () => {
      this.searchKey();
    });
  }

  onChange(key, val) {
    this.setState({ [key]: val })
  }


  async openUpdate(item) {
    await this.getCompanyData(item.Company_Id)
    await this.getTypeKeyData(item.Type_Key)
    await this.getHardWData(item.Value)

    this.setState({
      modalCom: !this.state.modalCom,
      action: "update",
      id: item['_id'],
      Status: item.Status
    })
  }

  async updateUser() {
    const { Status } = this.state

    const body = {
      id: this.state.id,
      Status: Status
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.UPDATE_KEY,
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
      url: Constants.DELETE_KEY,
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

  async getCompanyData(id) {
    const resCompany = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_COMPANY,
      method: 'POST',
    });

    if (id != '' || id != undefined) {
      const currentC = await axios({
        baseURL: Constants.BASE_URL,
        url: Constants.LIST_COMPANY_WITH_ID + id,
        method: 'POST',
      });
      if (currentC.data.data != null || currentC.data.data != undefined) {
        this.setState({ currentCompany: currentC.data.data.Name });
      }
    }
    this.setState({ dataCompany: resCompany.data.data });
  }

  async getTypeKeyData(id) {
    const resType = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_TYPEKEY,
      method: 'GET',
    });

    if (id != '' || id != undefined) {
      const currentTypeKey = await axios({
        baseURL: Constants.BASE_URL,
        url: Constants.LIST_TYPEKEY_WITH_ID + id,
        method: 'GET',
      });
      if (currentTypeKey.data.data != null || currentTypeKey.data.data != undefined) {
        this.setState({ currentTypeKey: currentTypeKey.data.data.Name });
      }
    }
    this.setState({ dataTypeKey: resType.data.data });
  }

  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { data, key, viewingUser, communities, dataCompany, hidden,
      currentCompany, dataTypeKey, currentTypeKey, action, arrPagination,
      indexPage, dataHardWare, currentHardWare, keyName,
      keyCodeCompany, keyTypeKey, keyActive, keyEndDate, keyStatus, keyValue } = this.state;

    if (!this.state.isLoading) {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <p style={styles.success}>{this.state.updated}</p>
              <p style={styles.danger}>{this.state.deleted}</p>
              <Card>
                <CardHeader>
                  Quản lý khóa
                  <div style={styles.tags}>
                    <CRow>
                      <CCol sm="6" lg="12">
                        <CRow>
                          <CCol sm="6" lg="4">
                            <div>
                              <Input style={styles.searchInput} onChange={(e) => {
                                this.actionSearch(e, "key");
                              }} name="key" value={key} placeholder="Từ khóa" />
                            </div>
                          </CCol>

                          <CCol sm="6" lg="4">
                            <CSelect style={styles.flexOption} onChange={e => {

                              this.actionSearch(e, "keyStatus");

                            }} custom>
                              <option value={""}>-----</option>
                              {
                                ['INSTOCK', 'AVAILABLE', 'ACTIVED', 'DISABLE'].map((item, i) => {
                                  return (
                                    <option value={item}>{item}</option>
                                  );
                                })
                              }
                            </CSelect>
                          </CCol>
                          <CCol sm="6" lg="4">
                            <Button color="primary" style={{ width: '100%', marginTop: 5 }} size="sm" onClick={e => { this.resetSearch() }}>Làm mới tìm kiếm</Button>
                          </CCol>
                        </CRow>
                      </CCol>
                      <CCol sm="6" lg="12">
                        <Button outline color="primary" style={styles.floatRight} size="sm" onClick={e => this.toggleModal("new")}>Thêm mới</Button>
                      </CCol>
                    </CRow>
                  </div>
                </CardHeader>
                <CardBody>
                  <table ble className="table table-hover table-outline mb-0 d-none d-sm-table">
                    <thead className="thead-light">
                      <tr>
                        <th className="text-center">STT.</th>
                        <th className="text-center">Tên key</th>
                        <th className="text-center">Ngày kích hoạt</th>
                        <th className="text-center">Ngày hết hạn</th>
                        <th className="text-center">Giá trị</th>
                        <th className="text-center">Trạng thái</th>
                        <th className="text-center">#</th>
                      </tr>
                    </thead>
                    <tbody>
                      <td colSpan="10" hidden={hidden} className="text-center">Không tìm thấy dữ liệu</td>
                      {
                        data != undefined ?
                          data.map((item, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-center">{item.Name}</td>
                                <td className="text-center">
                                  {
                                    item.Start_Date != null || item.Start_Date != undefined ?
                                      (new Date(item.Start_Date)).toLocaleDateString() + ' ' + (new Date(item.Start_Date)).toLocaleTimeString() : ""
                                  }
                                </td>
                                <td className="text-center">
                                  {
                                    item.End_Date != null || item.End_Date != undefined ?
                                      (new Date(item.End_Date)).toLocaleDateString() + ' ' + (new Date(item.End_Date)).toLocaleTimeString() : ""
                                  }
                                </td>
                                <td className="text-center">{item.Value}</td>
                                <td className="text-center">
                                  <CBadge color={this.getBadge(item.Status)}>
                                    {item.Status}
                                  </CBadge>
                                </td>
                                <td className="text-center">
                                  <Button style={styles.mgl5} outline color="primary" size="sm" onClick={async (e) => await this.openUpdate(item)} >Cập nhật</Button>{' '}
                                  <Button outline color="danger" size="sm" onClick={(e) => { this.openDelete(item) }}>Xoá</Button>
                                </td>
                              </tr>
                            );
                          }) : ""
                      }
                    </tbody>
                  </table>
                </CardBody>
              </Card>
              <div style={{ float: 'right' }}>
                <Pagination count={arrPagination.length} color="primary" onChange={(e, v) => {
                  this.setState({ data: arrPagination[v - 1], indexPage: v - 1 })
                }} />
              </div>
            </Col>
          </Row>

          <Modal isOpen={this.state.modalCom} className={this.props.className}>
            <ModalHeader>{this.state.action == 'new' ? `Tạo mới` : `Cập nhật`}</ModalHeader>

            <ModalBody>
              {
                action == 'new' ? "" : <div>
                  <label style={styles.flexLabel} htmlFor="tag">Status:</label>
                  <select style={styles.flexOption} name="Status" onChange={e => this.onChange("Status", e.target.value)}>
                    <option value={this.state.Status}>{this.state.Status == '' ? ` - - - - - - - - - - ` : this.state.Status}</option>
                    <option value={'INSTOCK'}>INSTOCK</option>
                    <option value={'AVAILABLE'}>AVAILABLE</option>
                    <option value={'ACTIVED'}>ACTIVED</option>
                    <option value={'DISABLE'}>DISABLE</option>
                  </select>
                </div>
              }
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={e => { this.state.action === 'new' ? this.updateUser() : this.updateUser() }} disabled={this.state.isLoading}>Lưu</Button>{' '}
              <Button color="secondary" onClick={e => this.setState({ modalCom: !this.state.modalCom })}>Đóng</Button>
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
      <div className="sweet-loading">
        <DotLoader css={override} size={50} color={"#123abc"} loading={this.state.isLoading} speedMultiplier={1.5} />
      </div>
    );
  }
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
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
    width: 200,
    margin: '1px'
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
  wh12: {
    width: "10%",
    float: "left",
    height: "80px"
  },
  wh15: {
    width: "15%",
    float: "left",
    height: "80px"
  },
  w5: {
    width: "12%",
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
    marginRight: "5px"
  },
  searchInput: {
    width: "200px",
    display: 'inline-block',
    margin: '1px'
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

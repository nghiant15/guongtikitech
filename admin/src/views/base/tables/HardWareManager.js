import React, { Component } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  ModalHeader, ModalBody, ModalFooter, Modal
} from 'reactstrap';

import {
  CBadge
} from '@coreui/react'

import 'moment-timezone';

import Constants from "./../../../contants/contants";
import Pagination from '@material-ui/lab/Pagination';
import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";
import axios from 'axios'

class PackageSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      key: '',
      keyName: '',
      keyActive: '',
      keyEnd: '',
      keyStatus: '',
      keyCode: '',

      page: 1,
      itemsCount: 0,
      limit: 20,
      totalActive: 0,
      modalCom: false,


      updated: '',
      dataApi: [],
      action: 'new',
      Name: "",
      Active_Date: new Date(),
      End_Date: new Date(),
      Status: "",
      modalDelete: false,
      delete: null,
      dataCompany: [],
      currentCompany: '',
      arrPagination: [],
      indexPage: 0,
      role: localStorage.getItem('role'),
      company_id: localStorage.getItem('user'),
      token: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      isLoading: false
    };
  }
  async componentDidMount() {
    this.getData();
    let arr = JSON.parse(localStorage.getItem('url'));
    for (let i = 0; i < arr.length; i++) {
      if ("#" + arr[i].to == window.location.hash) {
        if (arr[i].hidden == true) {
          window.location.href = '#/'
        }
      }
    }
  }

  getBadge(status) {
    switch (status) {
      case 'Active': return 'success'
      default: return 'danger'
    }
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
      url: Constants.LIST_ORDER_DETAIL_COMPANY,
      method: 'POST',
      headers: this.state.token
    });

    let data = res.data.data
    console.log(data)
    this.pagination(data);
    this.setState({ dataApi: data });


    this.setState({ isLoading: false });
  }


  actionSearch(e, name_action) {
    this.setState({
      [name_action]: e.target.value
    }, () => {
      this.searchKey();
    });
  }

  async toggleModal(key) {
    if (key == 'new') {
      this.setState({
        modalCom: !this.state.modalCom,
        action: key,
        Name: "",
        Active_Date: new Date(),
        End_Date: new Date()
      })
    }
  }

  onChange(key, val) {
    this.setState({ [key]: val })
  }


  async openUpdate(item) {
    this.setState({
      modalCom: !this.state.modalCom,
      action: "update",
      id: item['_id'],
      Status: item.Status
    })
  }

  async updateStatus() {
    const { Status } = this.state

    const body = {
      id: this.state.id,
      status: Status
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.UPDATE_STATUS_HARDWARE_COMPANY,
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

  }

  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { data, action, isLoading, arrPagination } = this.state;
    if (!isLoading) {
      return (
        <div>
          <Card>
            <CardHeader>
              Danh sách phần cứng chủ quản
            </CardHeader>
            <CardBody>
              <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                <thead className="thead-light">
                  <tr>
                    <th className="text-center">STT.</th>
                    <th className="text-center">Mã phần cứng</th>
                    <th className="text-center">Ngày kích hoạt</th>
                    <th className="text-center">Ngày hết hạn</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center">#</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data != undefined ?
                      data.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td className="text-center">{i + 1}</td>
                            <td className="text-center">{item.HardWareID[0].Key}</td>
                            <td className="text-center">
                              {(new Date(item.Active_Date)).toLocaleDateString() + ' ' + (new Date(item.Active_Date)).toLocaleTimeString()}
                            </td>
                            <td className="text-center">
                              {(new Date(item.HardWareID[0].End_Date)).toLocaleDateString() + ' ' + (new Date(item.HardWareID[0].End_Date)).toLocaleTimeString()}
                            </td>
                            <td className="text-center">
                              <CBadge color={this.getBadge(item.Status)}>
                                {item.Status}
                              </CBadge>
                            </td>
                            <td className="text-center">
                              <Button outline color="primary" size="sm" onClick={(e) => this.openUpdate(item)} >Cập nhật</Button>
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

          <Modal isOpen={this.state.modalCom} className={this.props.className}>
            <ModalHeader>{action == 'new' ? `Tạo mới` : `Cập nhật`}</ModalHeader>
            <ModalBody>
              {
                action == 'new' ? "" : <div>
                  <label style={styles.flexLabel} htmlFor="tag">Trạng thái:</label>
                  <select style={styles.flexOption} name="Status" onChange={e => this.onChange("Status", e.target.value)}>
                    <option value={this.state.Status}>{this.state.Status == '' ? ` - - - - - - - - - - ` : this.state.Status}</option>
                    {
                      ['Active', 'DISABLE'].map((item, i) => {
                        if (item == this.state.Status) {
                          return (
                            <option selected value={item}>{item}</option>
                          );
                        } else {
                          return (
                            <option value={item}>{item}</option>
                          );
                        }
                      })
                    }
                  </select>
                </div>
              }
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={e => { this.state.action === 'new' ? this.addPackageSale() : this.updateStatus() }} disabled={this.state.isLoading}>Lưu</Button>{' '}
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
  wa10: {
    width: "5%",
    float: "left",
    height: "80px"
  },
  wh16: {
    width: "17%",
    float: "left",
    height: "80px"
  },
  wh15: {
    width: "20%",
    float: "left",
    height: "80px"
  },
  w5: {
    width: "20%",
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
    marginBottom: '5px'
  }
}

export default PackageSale;

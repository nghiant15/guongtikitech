import React, { Component } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Button, Input,
  ModalHeader, ModalBody, ModalFooter, Modal
} from 'reactstrap';

import {
  CRow,
  CCol
} from '@coreui/react'

import { connect } from 'react-redux';
import {
  onSaveID,
  onSaveSeed
} from '../../../redux/data/actions'
import 'moment-timezone';
import Pagination from '@material-ui/lab/Pagination';
import Constants from "./../../../contants/contants";
import API_CONNECT from "../../../../src/helpers/callAPI";
import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      key: '',
      keyStatus: '',
      modalCom: false,
      dataApi: [],
      arrDetail: [],
      indexPage: 0,
      role: localStorage.getItem('role'),
      company_id: localStorage.getItem('user'),
      isLoading: false,
      isLoadingTable: false,
      hidden: false,
      dataAll: [],
      hidden_all: false,
      token: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      countPagination: 0
    };
  }
  async componentDidMount() {
    this.getAllData(0);
    let arr = JSON.parse(localStorage.getItem('url'));
    for (let i = 0; i < arr.length; i++) {
      if ("#" + arr[i].to == window.location.hash) {
        if (arr[i].hidden == true) {
          window.location.href = '#/'
        }
      }
    }
  }

  countType(arr, phone) {
    const count = arr.filter(data => data.Phone == phone);
    return count.length;
  }

  getAllData = async (index) => {
    this.setState({ isLoading: true });

    var resAll = await API_CONNECT(Constants.LIST_CUSTOMER_V2, {
      index: index
    }, this.state.token, "GET")

  
    let dataRes = resAll.data.data;
    console.log("resAll",resAll);
    let dataLength = resAll.data.count;

    // if (dataRes.length == 0) {
    //   this.setState({
    //     hidden_all: false
    //   })
    // } else {
    //   this.setState({
    //     hidden_all: true
    //   })
    // }

    this.setState({ dataApi: dataRes, dataAll: dataRes, isLoading: false, isLoadingTable: false, countPagination: dataLength });
  }

  getDataPagination = async (index) => {
    this.setState({ isLoadingTable: true });

    var resAll = await API_CONNECT(Constants.LIST_CUSTOMER_V2, {
      index: index
    }, this.state.token, "POST")

    let dataRes = resAll.data.data;
    let dataLength = resAll.data.count;

    if (dataRes.length == 0) {
      this.setState({
        hidden_all: false
      })
    } else {
      this.setState({
        hidden_all: true
      })
    }

    this.setState({ dataApi: dataRes, dataAll: dataRes, isLoadingTable: false, countPagination: dataLength });
  }

  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  openDetailHistory = async (phone) => {
    this.setState({ modalCom: !this.state.modalCom })
    const result = await API_CONNECT(Constants.LIST_DETAIL_CUSTOMER, {
      phone: phone
    }, this.state.token, "POST")

    this.setState({ arrDetail: result.data })
  }

  render() {
    const { key, dataAll, countPagination, isLoading, isLoadingTable,
      hidden_all, arrDetail } = this.state;

    if (!isLoading) {
      return (
        <div>
          <Card>
            <CardHeader> Danh sách khách hàng
              <div style={styles.tags}>
                <CRow>
                  <CCol sm="6" lg="6">
                    <div>
                      <Input style={styles.searchInput} onChange={(e) => {

                      }} name="key" value={key} placeholder="Từ khóa" />
                    </div>
                  </CCol>

                  <CCol sm="6" lg="6">
                    <Button color="primary" style={{ width: '100%', marginTop: 5 }} size="sm" onClick={e => { this.resetSearch() }}>Làm mới tìm kiếm</Button>
                  </CCol>
                </CRow>
              </div>
            </CardHeader>
            <CardBody>
              {
                <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                  <thead className="thead-light">
                    <tr>
                      <th className="text-center">STT.</th>
                      <th className="text-center">Tên</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">Số điện thoại</th>
                      <th className="text-center">Số lần ghé thăm</th>
                      <th className="text-center">Lần cuối đến</th>
                      <th className="text-center">#</th>
                    </tr>
                  </thead>
                  {
                    isLoadingTable == false  ?
                      <tbody>
                        {
                          dataAll != undefined ?
                            dataAll.map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td className="text-center">{i + 1}</td>
                                  <td className="text-center">{item.Name}</td>
                                  <td className="text-center">{item.Email}</td>
                                  <td className="text-center">{item.Phone}</td>
                                  <td className="text-center">{item.count}</td>
                                  <td className="text-center">
                                  06/01/2024
                                  </td>
                                  <td className="text-center">
                                    <Button outline color="info" size="sm" onClick={() => { this.openDetailHistory(item.Phone) }} >Chi tiết lịch sử đến</Button>
                                  </td>
                                </tr>
                              );
                            }) : ""
                        }
                      </tbody> :
                      <div className="sweet-loading" style={{ padding: 20, }}>
                        <DotLoader css={override} size={50} color={"#123abc"} loading={isLoadingTable} speedMultiplier={1.5} />
                      </div>
                  }

                </table>
              }
            </CardBody>
          </Card>
        

          <Modal size='xl' isOpen={this.state.modalCom} className={this.props.className}>
            <ModalHeader>Chi tiết lịch sử đến</ModalHeader>
            <ModalBody>
              {
                <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                  <thead className="thead-light">
                    <tr>
                      <th className="text-center">STT.</th>
                      <th className="text-center">Tên</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">Số điện thoại</th>
                      <th className="text-center">Ngày đến</th>
                    </tr>
                  </thead>
                  <tbody>
                    <td colSpan="8" hidden={arrDetail.length > 0 ? true : false} className="text-center">Không tìm thấy dữ liệu</td>
                    {
                      arrDetail != undefined ?
                        arrDetail.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td className="text-center">{i + 1}</td>
                              <td className="text-center">{item.Name}</td>
                              <td className="text-center">{item.Email}</td>
                              <td className="text-center">{item.Phone}</td>
                              <td className="text-center">
                                  06/01/2024
                              </td>
                            </tr>
                          );
                        }) : ""
                    }
                  </tbody>
                </table>
              }
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={e => { this.setState({ modalCom: !this.state.modalCom }) }}>Đóng</Button>
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
  wa10: {
    width: "5%",
    float: "left",
    height: "60px"
  },
  sale_times: {
    width: "8%",
    float: "left",
    height: "60px",
    textAlign: 'center'
  },
  pagination: {
    marginRight: '5px'
  },
  flexLabel: {
    width: 100
  },
  flexOption: {
    width: 160,
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
    width: "11%",
    float: "left",
    height: "60px",
    textAlign: 'center'
  },
  ws12: {
    width: "13%",
    float: "left",
    height: "60px",
    textAlign: 'center'
  },
  wh15: {
    width: "15%",
    float: "left",
    height: "60px",
    textAlign: 'center'
  },
  w5: {
    width: "22%",
    float: "left",
    height: "60px"
  },
  w5_10: {
    width: "5%",
    float: "left",
    height: "60px"
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
    width: "160px",
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

const mapStateToProps = state => {
  return {
    data: state.getData_AllAPI
  }
}


export default connect(mapStateToProps, { onSaveID, onSaveSeed })(Users);


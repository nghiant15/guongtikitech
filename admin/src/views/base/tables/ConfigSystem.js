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
  CSelect,
  CInputRadio,
  CLabel,
  CFormGroup
} from '@coreui/react'

import 'moment-timezone';
import Constants from "./../../../contants/contants";
import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";
import TextFieldGroup from "../../../views/Common/TextFieldGroup";
import API_CONNECT from "../../../../src/helpers/callAPI";
import axios from 'axios'
import Pagination from '@material-ui/lab/Pagination';

let headers = new Headers();
const auth = localStorage.getItem('auth');
headers.append('Authorization', 'Bearer ' + auth);
headers.append('Content-Type', 'application/json');
class ConfigSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      key: '',
      totalActive: 0,
      dataApi: [],
      action: 'new',
      modalConfig: false,
      arrPagination: [],
      indexPage: 0,
      dataCompany: [],
      statusConfig: false,
      dataConfig: false,
      company_id: "",
      code: "",
      type: "",
      value: "",
      show_config: false
    };
  }
  async componentDidMount() {
    this.getData();
    this.getCompanyData();
    let arr = JSON.parse(localStorage.getItem('url'));
    for (let i = 0; i < arr.length; i++) {
      if ("#" + arr[i].to == window.location.hash) {
        if (arr[i].hidden == true) {
          window.location.href = '#/'
        }
      }
    }
  }

  async getCompanyData() {
    const resCompany = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_COMPANY,
      method: 'POST'
    });
    this.setState({ dataCompany: resCompany.data.data });
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
      url: Constants.LIST_COMPANY,
      method: 'POST',
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
    const { indexPage, key } = this.state;

    if (key != '') {
      let d = []
      this.state.dataApi.map(val => {
        if ((val.Email.toLocaleUpperCase().includes(key.toLocaleUpperCase()))) {

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

  async toggleModal(key, item) {

    await API_CONNECT(Constants.CONFIG_BY_ID, {
      company_id: item._id
    }, "", "POST")
    const res = await API_CONNECT(Constants.CONFIG_BY_ID, {
      company_id: item._id
    }, "", "POST")

    const status = res.is_success;
    const data = res.data

    if (data.type == undefined || data.type == "0") {
      this.setState({ show_config: false })
    } else {
      this.setState({ show_config: true })
    }

    if (key == 'new') {
      this.setState({
        modalConfig: !this.state.modalConfig,
        action: key,
        statusConfig: status,
        dataConfig: data,
        company_id: item._id,
        code: data.code == undefined ? "" : data.code,
        type: data.type == undefined ? "0" : "1",
        value: data.value == undefined ? "" : data.value,
      })
    }
  }

  onChange(key, val) {
    this.setState({ [key]: val })
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
      key: ''
    }, () => {
      this.searchKey();
    });
  }

  async onChooseConfig(e) {
    if (e.target.value == "0") {
      this.setState({ show_config: false, type: e.target.value })
    } else {
      this.setState({ show_config: true, type: e.target.value })
    }
  }

  async onSaveConfig() {
    const { company_id, type, code, value } = this.state

    if (code == null || code == ''
      || value == null || value == '') {
      alert("Mã config hoặc đường dẫn không được trống !!!");
      return
    }

    const body = {
      company_id: company_id,
      code: code,
      type: type,
      value: value,
    }

    const res = await API_CONNECT(Constants.UPDATE_CONFIG, body, "", "POST")

    if (res.is_success == true) {
      this.setState({ modalConfig: !this.state.modalConfig })
    } else {
      this.setState({ modalConfig: false })
      alert(res.message);
    }
  }

  render() {
    const { data, key, arrPagination } = this.state;
    if (!this.state.isLoading) {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Danh sách công ty
                  <div style={styles.tags}>
                    <CRow>
                      <CCol sm="12" lg="12">
                        <CRow>
                          <CCol sm="12" lg="6">
                            <div>
                              <Input style={styles.searchInput} onChange={(e) => {
                                this.actionSearch(e, "key");
                              }} name="key" value={key} placeholder="Từ khóa" />
                            </div>
                          </CCol>
                          <CCol sm="12" lg="6">
                            <Button color="primary" style={{ width: '100%', marginTop: 5 }} size="sm" onClick={e => { this.resetSearch() }}>Làm mới tìm kiếm</Button>
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                  </div>
                </CardHeader>
                <CardBody>
                  <table ble className="table table-hover table-outline mb-0 d-none d-sm-table">
                    <thead className="thead-light">
                      <tr>
                        <th className="text-center">STT.</th>
                        <th className="text-center">Tên Công Ty</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Số điện thoại</th>
                        <th className="text-center">Fax</th>
                        <th className="text-center">Địa chỉ</th>
                        <th className="text-center">Ngày tạo</th>
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
                                <td className="text-center">{item.Name}</td>
                                <td className="text-center">{item.Email}</td>
                                <td className="text-center">{item.Phone}</td>
                                <td className="text-center">{item.Fax}</td>
                                <td className="text-center">{item.Address}</td>
                                <td className="text-center">
                                  {(new Date(item.Create_Date)).toLocaleDateString() + ' ' + (new Date(item.Create_Date)).toLocaleTimeString()}
                                </td>
                                <td className="text-center">
                                  <Button outline color="primary" size="sm" onClick={async (e) => { this.toggleModal('new', item) }} >Cấu hình gian hàng </Button>
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

          <Modal isOpen={this.state.modalConfig} toggle={e => this.setState({ modalConfig: !this.state.modalConfig })} className={this.props.className}>
            <ModalHeader toggle={e => this.setState({ modalConfig: !this.state.modalConfig })}>Cấu hình gian hàng</ModalHeader>
            <ModalBody>
              <CFormGroup row>
                <CCol md="12">
                  {
                    ['0', '1'].map((item, i) => {
                      if (this.state.statusConfig == false) {
                        if (item == "0") {
                          return (
                            <CFormGroup variant="checkbox">
                              <CInputRadio defaultChecked className="form-check-input" id={item} name="radios" value={item} onClick={(e) => { this.onChooseConfig(e) }} />
                              <CLabel variant="checkbox" htmlFor={item}>{item == "0" ? "Gian hàng TIKITECH" : "Gian hàng công ty"}</CLabel>
                            </CFormGroup>
                          );
                        } else {
                          return (
                            <CFormGroup variant="checkbox">
                              <CInputRadio className="form-check-input" id={item} name="radios" value={item} onClick={(e) => { this.onChooseConfig(e) }} />
                              <CLabel variant="checkbox" htmlFor={item}>{item == "0" ? "Gian hàng TIKITECH" : "Gian hàng công ty"}</CLabel>
                            </CFormGroup>
                          );
                        }
                      } else {
                        if (item == this.state.dataConfig.type) {
                          return (
                            <CFormGroup variant="checkbox">
                              <CInputRadio defaultChecked className="form-check-input" id={item} name="radios" value={item} onClick={(e) => { this.onChooseConfig(e) }} />
                              <CLabel variant="checkbox" htmlFor={item}>{item == "0" ? "Gian hàng TIKITECH" : "Gian hàng công ty"}</CLabel>
                            </CFormGroup>
                          );
                        } else {
                          return (
                            <CFormGroup variant="checkbox">
                              <CInputRadio className="form-check-input" id={item} name="radios" value={item} onClick={(e) => { this.onChooseConfig(e) }} />
                              <CLabel variant="checkbox" htmlFor={item}>{item == "0" ? "Gian hàng TIKITECH" : "Gian hàng công ty"}</CLabel>
                            </CFormGroup>
                          );
                        }
                      }
                    })
                  }
                </CCol>
              </CFormGroup>

              <TextFieldGroup
                field="code"
                label="Mã config"
                disabled={this.state.show_config ? false : true}
                value={this.state.code}
                placeholder={"Mã config"}
                onChange={e => this.onChange("code", e.target.value)}
              />

              <TextFieldGroup
                field="value"
                label="Đường dẫn"
                disabled={this.state.show_config ? false : true}
                value={this.state.value}
                placeholder={"Đường dẫn"}
                onChange={e => this.onChange("value", e.target.value)}
              />

            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => {
                this.onSaveConfig()
              }}>Lưu</Button>{' '}
              <Button color="secondary" onClick={() => this.setState({ modalConfig: !this.state.modalConfig })}>Đóng</Button>
            </ModalFooter>
          </Modal>
        </div >
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
    float: 'right',
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
    width: "8%",
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
  }
}

export default ConfigSystem;

import React, { Component } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Constants from "./../../../contants/contants";
import TextFieldGroup from "../../../views/Common/TextFieldGroup";
import axios from 'axios'
import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";
import Pagination from '@material-ui/lab/Pagination';

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
      HardWare_Name: "",
      Call_Name: "",
      Serial_Number: "",
      UniqueID: "",
      Active_Date: new Date(),
      End_Date: new Date(),
      Status: "",
      modalDelete: false,
      delete: null,
      dataCompany: [],
      currentCompany: '',
      arrPagination: [],
      indexPage: 0,
      hidden: false,
      token: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      arrStatus: ['INSTOCK', 'AVAILABLE']
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
      case 'INSTOCK': return 'success'
      case 'AVAILABLE': return 'secondary'
      case 'Locked': return 'warning'
      case 'Deactived': return 'danger'
      default: return 'primary'
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

  getData = async () => {
    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_HARDWARE,
      method: 'POST',
      headers: this.state.token
    });

    let data = res.data.data

    console.log(data)
    this.pagination(data);
    this.setState({ dataApi: data });

    let active = 0

    data.map(val => {
      if (val.Status == "Actived") {
        active = active + 1
      }
    })

    this.setState({ isLoading: false, totalActive: active });
  }

  searchKey() {
    const { key, keyStatus } = this.state;

    if (key != '' || keyStatus != '') {
      let d = []
      this.state.dataApi.map(val => {
        if ((val.Name.toLocaleUpperCase().includes(key.toLocaleUpperCase()) ||
          val.Key.toLocaleUpperCase().includes(key.toLocaleUpperCase())) &&
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

      this.setState({ data: this.state.dataApi, totalActive: active })
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
      keyName: '',
      keyActive: new Date(),
      keyEnd: new Date(),
      keyStatus: '',
      keyCode: ''
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
        HardWare_Name: "",
        Call_Name: "",
        Serial_Number: "",
        UniqueID: "",
        Active_Date: new Date(),
        End_Date: new Date()
      })
    }
  }

  onChange(key, val) {
    this.setState({ [key]: val })
  }

  async addHardWare() {
    const { Name, Active_Date, End_Date, HardWare_Name, Call_Name, Serial_Number, UniqueID } = this.state

    if (Name == null || Name == '' || UniqueID == null || UniqueID == '') {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return
    }

    const body = {
      Name: Name,
      HardWare_Name: HardWare_Name,
      Call_Name: Call_Name,
      Serial_Number: Serial_Number,
      UniqueID: UniqueID,
      Active_Date: Active_Date,
      End_Date: End_Date
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.ADD_HARDWARE,
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
      HardWare_Name: item.HardWare_Name,
      Call_Name: item.Call_Name,
      Serial_Number: item.Serial_Number,
      UniqueID: item.UniqueID,
      Active_Date: item.Active_Date,
      End_Date: item.End_Date,
      Status: item.Status,
      id: item['_id'],
      Status: item.Status
    })
  }

  async updateHardWare() {
    const { Name, Active_Date, End_Date, HardWare_Name, Call_Name, Serial_Number, UniqueID, Status } = this.state

    if (Name == null || Name == '' || UniqueID == null || UniqueID == '') {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return
    }

    const body = {
      Name: Name,
      HardWare_Name: HardWare_Name,
      Call_Name: Call_Name,
      Serial_Number: Serial_Number,
      UniqueID: UniqueID,
      Active_Date: Active_Date,
      End_Date: End_Date,
      id: this.state.id,
      Status: Status
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.UPDATE_HARDWARE,
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
      url: Constants.DELETE_HARDWARE,
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

  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { data, key, action, End_Date, Active_Date, arrPagination, arrStatus, hidden } = this.state;
    if (!this.state.isLoading) {
      return (
        <div>
          <Card>
            <CardHeader>
              Quản lí phần cứng
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
                          {
                            arrStatus.map((item, i) => {
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
              <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                <thead className="thead-light">
                  <tr>
                    <th className="text-center">STT.</th>
                    <th className="text-center">Tên</th>
                    <th className="text-center">Ngày kích hoạt</th>
                    <th className="text-center">Ngày hết hạn</th>
                    <th className="text-center">Mã</th>
                    <th className="text-center">Ngày tạo</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center">#</th>
                  </tr>
                </thead>
                <tbody>
                  <td colSpan="10" hidden={hidden} className="text-center">Không tìm thấy phần cứng nào trong kho</td>
                  {
                    data != undefined ?
                      data.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td className="text-center">{i + 1}</td>
                            <td className="text-center">{item.Name}</td>
                            <td className="text-center">
                              {(new Date(item.Active_Date)).toLocaleDateString() + ' ' + (new Date(item.Active_Date)).toLocaleTimeString()}
                            </td>
                            <td className="text-center">
                              {(new Date(item.End_Date)).toLocaleDateString() + ' ' + (new Date(item.End_Date)).toLocaleTimeString()}
                            </td>
                            <td className="text-center">{item.Key}</td>
                            <td className="text-center">
                              {(new Date(item.Create_Date)).toLocaleDateString() + ' ' + (new Date(item.Create_Date)).toLocaleTimeString()}
                            </td>
                            <td className="text-center">
                              <CBadge color={this.getBadge(item.Status)}>
                                {item.Status}
                              </CBadge>
                            </td>
                            <td className="text-center">
                              <Button outline color="primary" size="sm" onClick={(e) => this.openUpdate(item)} >Cập nhật</Button>{' '}
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



          <Modal isOpen={this.state.modalCom} className={this.props.className}>
            <ModalHeader>{this.state.action == 'new' ? `Tạo mới` : `Cập nhật`}</ModalHeader>
            <ModalBody>
              <TextFieldGroup
                field="Name"
                label="Tên phần cứng"
                value={this.state.Name}
                placeholder={"Tên phần cứng"}
                onChange={e => this.onChange("Name", e.target.value)}
              />

              <TextFieldGroup
                field="HardWare_Name"
                label="Tên thiết bị"
                value={this.state.HardWare_Name}
                placeholder={"Tên thiết bị"}
                onChange={e => this.onChange("HardWare_Name", e.target.value)}
              />

              <TextFieldGroup
                field="Call_Name"
                label="Tên gọi"
                value={this.state.Call_Name}
                placeholder={"Tên gọi"}
                onChange={e => this.onChange("Call_Name", e.target.value)}
              />

              <TextFieldGroup
                field="Serial_Number"
                label="Mã thiết bị"
                value={this.state.Serial_Number}
                placeholder={"Mã thiết bị"}
                onChange={e => this.onChange("Serial_Number", e.target.value)}
              />

              <TextFieldGroup
                field="UniqueID"
                label="Mã Unique"
                value={this.state.UniqueID}
                placeholder={"Mã Unique"}
                onChange={e => this.onChange("UniqueID", e.target.value)}
              />

              <div style={styles.datePicker}>
                <label style={styles.flexLabel}>Ngày kích hoạt:</label>
                <DatePicker style={styles.flexOption} selected={new Date(Active_Date)} onChange={(date) => this.setState({ Active_Date: date })} />
              </div>

              <div style={styles.datePicker}>
                <label style={styles.flexLabel}>Ngày hết hạn:</label>
                <DatePicker style={styles.flexOption} selected={new Date(End_Date)} onChange={(date) => this.setState({ End_Date: date })} />
              </div>

              {
                action == 'new' ? "" : <div>
                  <label style={styles.flexLabel} htmlFor="tag">Trạng thái:</label>
                  <select style={styles.flexOption} name="Status" onChange={e => this.onChange("Status", e.target.value)}>
                    {
                      arrStatus.map((item, i) => {
                        return (
                          <option selected={item == this.state.Status ? true : false} value={item}>{item}</option>
                        );
                      })
                    }
                  </select>
                </div>
              }
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={e => { this.state.action === 'new' ? this.addHardWare() : this.updateHardWare() }} disabled={this.state.isLoading}>Lưu</Button>{' '}
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

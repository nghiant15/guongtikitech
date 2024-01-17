import React, { Component } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Button, Input,
  ModalHeader, ModalBody, ModalFooter, Modal
} from 'reactstrap';

import {
  CSelect,
  CRow,
  CCol,
  CBadge
} from '@coreui/react'

import { connect } from 'react-redux';
import {
  onSaveID,
  onSaveSeed
} from '../../../redux/data/actions'
import 'moment-timezone';
import Pagination from '@material-ui/lab/Pagination';
import Constants from "./../../../contants/contants";
import TextFieldGroup from "../../../views/Common/TextFieldGroup";
import axios from 'axios'
import { css } from "@emotion/react";
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
      activePage: 1,
      totalActive: 0,
      modalCom: false,
      updated: '',
      dataApi: [],
      action: 'new',
      Email: '',
      Address: '',
      Name: '',
      Phone: '',
      Gender: 'Nam',
      Company_Id: '',
      Role_Id: '',
      UserName: '',
      Password: '',
      Sale_Id: '',
      Code: '',
      Status: '',
      modalDelete: false,
      delete: null,
      dataCompany: [],
      currentCompany: '',
      dataSale: [],
      currentSale: '',
      dataRole: [],
      currentRole: '',
      arrPagination: [],
      indexPage: 0,
      arrPagination_All: [],
      indexPage_All: 0,
      role: localStorage.getItem('role'),
      company_id: localStorage.getItem('user'),
      see_detail: true,
      month: 0,
      arrTemp: [],
      arrMonth: [
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
      ],
      arrMonthWithDefault: [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
      ],
      isLoading: true,
      hidden: false,
      nameSale: '',
      dataAll: [],
      hidden_all: false,
      isSale: false,
      token: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      arrAllUser: []
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
      case 'Actived': return 'success'
      case 'Inactive': return 'secondary'
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

  pagination_all(dataApi) {
    var i, j, temparray, chunk = 5;
    let arrTotal = [];
    for (i = 0, j = dataApi.length; i < j; i += chunk) {
      temparray = dataApi.slice(i, i + chunk);
      arrTotal.push(temparray);
    }
    if (arrTotal.length == 0) {
      this.setState({
        hidden_all: false
      })
    } else {
      this.setState({
        hidden_all: true
      })
    }
    this.setState({ arrPagination_All: arrTotal, dataAll: arrTotal[this.state.indexPage_All] });
  }

  getUserSale = async (sale_id) => {
    const { company_id } = this.state;
    this.setState({ isLoading: true });
    var id = JSON.parse(company_id);

    var bodyCustomer = {
      condition: {
        Company_Id: id.company_id,
        Sale_Id: sale_id
      }
    }

    var res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_CUSTOMER,
      method: 'POST',
      data: bodyCustomer,
      headers: this.state.token
    })

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

  countType(arr, phone) {
    const count = arr.filter(data => data.Phone == phone);
    return count.length;
  }

  getUserSale_ByMonth = async (sale_id, month) => {
    const { company_id } = this.state;
    var id = JSON.parse(company_id);

    var bodyCustomer = {
      "month": month,
      "company_id": id.company_id,
      "sale_id": sale_id
    }

    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.GET_USER_SALE_BY_MONTH,
      method: 'POST',
      data: bodyCustomer
    })

    this.setState({ dataApi: res.data.data, arrTemp: res.data.data });
    let arrCount_User_Per = [];
    var getArrTemp = this.state.arrTemp;
    for (let i = 0; i < getArrTemp.length; i++) {
      //check if exits in arr
      if (!arrCount_User_Per.some(item => getArrTemp[i].Phone == item.Phone)) {
        getArrTemp[i].count = this.countType(getArrTemp, getArrTemp[i].Phone);
        const resCal = await axios({
          baseURL: Constants.BASE_URL,
          url: Constants.GET_COEFFICIENT_PER_SALE,
          method: 'POST',
          data: {
            "month": month,
            "company_id": id.company_id,
            "phone": getArrTemp[i].Phone,
            "sale_id": this.props.data.idSale
          }
        });
        getArrTemp[i].coefficient = resCal.data.data.calculator;
        arrCount_User_Per.push(getArrTemp[i])
      }
    }

    this.pagination(arrCount_User_Per);
    this.setState({ isLoading: false });
  }

  getUserSale_ByMonth_forSale = async (sale_id, month) => {
    const { company_id } = this.state;
    this.setState({ isLoading: true });
    var id = JSON.parse(company_id);

    var bodyCustomer = {
      "month": month,
      "company_id": id.company_id,
      "sale_id": sale_id
    }

    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.GET_USER_SALE_BY_MONTH,
      method: 'POST',
      data: bodyCustomer
    })

    this.setState({ dataApi: res.data.data, arrTemp: res.data.data });
    let arrCount_User_Per = [];
    var getArrTemp = this.state.arrTemp;
    for (let i = 0; i < getArrTemp.length; i++) {
      //check if exits in arr
      if (!arrCount_User_Per.some(item => getArrTemp[i].Phone == item.Phone)) {
        getArrTemp[i].count = this.countType(getArrTemp, getArrTemp[i].Phone);
        const resCal = await axios({
          baseURL: Constants.BASE_URL,
          url: Constants.GET_COEFFICIENT_PER_SALE,
          method: 'POST',
          data: {
            "month": month,
            "company_id": id.company_id,
            "phone": getArrTemp[i].Phone,
            "sale_id": sale_id
          }
        });
        getArrTemp[i].coefficient = resCal.data.data.calculator;
        arrCount_User_Per.push(getArrTemp[i])
      }
    }
    this.pagination(arrCount_User_Per);
    this.setState({ isLoading: false });
  }

  getAllData = async () => {
    const { company_id } = this.state;
    this.setState({ isLoading: true });
    var id = JSON.parse(company_id);

    var resAll = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_CUSTOMER,
      method: 'POST',
      data: {
        condition: {
          Company_Id: id.company_id,
          Sale_Id: this.props.data.idSale
        }
      },
      headers: this.state.token
    })

    this.setState({ dataApi: resAll.data.data });

    let arrCount_All_User = [];

    for (let i = 0; i < resAll.data.data.length; i++) {
      //check if exits in arr
      if (!arrCount_All_User.some(item => resAll.data.data[i].Phone == item.Phone)) {
        resAll.data.data[i].count = this.countType(resAll.data.data, resAll.data.data[i].Phone);

        var resCal_all = await axios({
          baseURL: Constants.BASE_URL,
          url: Constants.CALCULATOR_ALL_USER_OF_SALE,
          method: 'POST',
          data: {
            "company_id": id.company_id,
            "phone": resAll.data.data[i].Phone,
            "sale_id": this.props.data.idSale
          }
        });
        resAll.data.data[i].coefficient = resCal_all.data.data.calculator;
        arrCount_All_User.push(resAll.data.data[i])
      }
    }

    this.pagination_all(arrCount_All_User);
    this.setState({ isLoading: false });
  }

  getData = async () => {
    this.setState({ isLoading: true });

    var res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.GET_SALE,
      method: 'POST',
      headers: this.state.token
    })

    let data = res.data.data

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

  async tableUserSale(id_sale, nameSale) {

    const { company_id, arrMonth } = this.state;
    var id = JSON.parse(company_id);

    await this.getUserSale_ByMonth(id_sale, "01");
    this.props.onSaveID(id_sale)
    this.getAllData();
    let arrTemp = [];

    for (let i = 0; i < arrMonth.length; i++) {
      const res = await axios({
        baseURL: Constants.BASE_URL,
        url: Constants.GET_USER_SALE_BY_MONTH,
        method: 'POST',
        data: {
          "month": arrMonth[i],
          "company_id": id.company_id,
          "sale_id": this.props.data.idSale
        }
      })

      arrTemp.push(res.data.data.length);
    }

    this.setState({ see_detail: false, nameSale: nameSale, arrAllUser: arrTemp })


  }

  async tableUserSale_forSale(month) {
    const { company_id } = this.state;
    var id = JSON.parse(company_id);
    await this.getUserSale_ByMonth_forSale(id.sale_id, month);
  }

  searchKey() {
    const { indexPage, key, keyStatus } = this.state;

    if (key != '' || keyStatus != '') {
      let d = []
      this.state.dataApi.map(val => {
        if ((val.Name.toLocaleUpperCase().includes(key.toLocaleUpperCase()) ||
          val.Email.toLocaleUpperCase().includes(key.toLocaleUpperCase()) ||
          val.Phone.toLocaleUpperCase().includes(key.toLocaleUpperCase())) &&
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
    console.log(name_action)
    this.setState({
      [name_action]: e.target.value
    }, () => {
      this.searchKey();
    });
  }

  resetSearch() {
    this.setState({
      keyName: '',
      keyEmail: '',
      keyPhone: '',
      keyCodeCompany: '',
      keyGender: '',
      keyStatus: ''
    }, () => {
      this.searchKey();
    });
  }

  async toggleModal(key) {
    this.setState({
      modalCom: !this.state.modalCom,
      action: key
    })

    await this.getRoleData()
    if (key == 'new') {
      this.setState({
        Email: '',
        Name: '',
        Phone: '',
        Gender: 'Nam',
        Company_Id: '',
        UserName: '',
        Password: '',
        Sale_Id: '',
        Code: ''
      })
    }
  }

  onChange(key, val) {
    this.setState({ [key]: val })
  }

  async addUser() {

    const { company_id } = this.state;
    var id = JSON.parse(company_id);
    console.log(id.company_id)
    const { Email, Name, Phone, UserName, Code, Password, Gender, Role_Id, Company_Id, Sale_Id, Address } = this.state

    
    if (Email == null || Email == ''
      || Name == null || Name == ''
      || Phone == null || Phone == ''
      || UserName == null || UserName == ''
     
      || Password == null || Password == '') {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return
    }

    const body = {
      Email: Email,
      Address: Address,
      Name: Name,
      Phone: Phone,
      Gender: Gender,
      Company_Id: id.company_id,
      Role_Id: Role_Id,
      UserName: UserName,
      Password: Password,
      Sale_Id: Sale_Id,
      Code: Code
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.ADD_USER,
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

  async openUpdate(item) {

    this.setState({
      modalCom: !this.state.modalCom,
      action: "update"
    })

    this.setState({
      Email: item.Email,
      Address: item.Address,
      Name: item.Name,
      Phone: item.Phone,
      Gender: item.Gender,
      Company_Id: item.Company_Id,
      Role_Id: item.Role_Id,
      UserName: item.UserName,
      Password: item.Password,
      Sale_Id: item.Sale_Id,
      Code: item.Code,
      id: item['_id'],
      Status: item.Status
    })
  }

  async updateUser() {
    const { company_id } = this.state;
    var id = JSON.parse(company_id);

    const { Email, Name, Phone, UserName, Code, Password, Gender, Role_Id,
      Company_Id, Sale_Id, Status, Address } = this.state

    if (Email == null || Email == ''
      || Name == null || Name == ''
      || Phone == null || Phone == ''
      || UserName == null || UserName == ''
      || Password == null || Password == '') {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return
    }

    const body = {
      Email: Email,
      Address: Address,
      Name: Name,
      Phone: Phone,
      Gender: Gender,
      Company_Id: id.company_id,
      Role_Id: Role_Id,
      UserName: UserName,
      Password: Password,
      Sale_Id: Sale_Id,
      Code: Code,
      id: this.state.id,
      Status: Status
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.UPDATE_USER,
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
      url: Constants.DELETE_USER,
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

  async getRoleData() {
    const resRole = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_ROLE,
      method: 'GET',
      headers: this.state.token
    });

    let data = resRole.data.data
    let current_role_id = ""
    for (let i = 0; i < data.length; i++) {
      if (data[i].Name == "SALES") {
        current_role_id = "65727a34424b4a0698883ed9"
      }
    }

    this.setState({ Role_Id: current_role_id });
  }

  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async getDataUser_ForSale(month) {
    const { role } = this.state;
    if (role == 'SALES') {
      this.setState({ isSale: true, month: month })
      await this.tableUserSale_forSale(month);
    }
  }

  async check(e) {
    if (e.target.value == "00") {
      this.getData();
      this.setState({ isSale: false })
    } else {
      await this.getDataUser_ForSale(e.target.value);
      this.setState({ month: e.target.value })
    }
  }

  render() {
    const { data, key, hidden, action, arrPagination, indexPage } = this.state;

    if (!this.state.isLoading) {
      return (

        <div>

          <Card>
            <CardHeader>

              Danh sách Sales ( Page: {this.state.indexPage + 1} )

              <div style={styles.tags}>
                <CRow>
                  <CCol sm="6" lg="12">
                    <CRow>
                      <CCol sm="12" lg="4">
                        <div>
                          <Input style={styles.searchInput} onChange={(e) => {
                            this.actionSearch(e, "key");
                          }} name="key" value={key} placeholder="Tên" />
                        </div>
                      </CCol>
                      <CCol sm="12" lg="4">
                        <CSelect style={styles.flexOption} onChange={e => {

                          this.actionSearch(e, "keyStatus");

                        }} custom>
                          {
                            ['Actived', 'Deactived', 'Locked'].map((item, i) => {
                              return (
                                <option value={item}>{item}</option>
                              );
                            })
                          }
                        </CSelect>
                      </CCol>
                      <CCol sm="12" lg="4">
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
                    <th className="text-center">Tên</th>
                    <th className="text-center">Công ty</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Số điện thoại</th>
                    <th className="text-center">Địa chỉ</th>
                    <th className="text-center">Ngày tạo</th>
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
                            <td className="text-center">{item.company_name}</td>
                            <td className="text-center">{item.Email}</td>
                            <td className="text-center">{item.Phone}</td>
                            <td className="text-center">{item.Address}</td>
                            <td className="text-center">
                              {(new Date(item.Create_Date)).toLocaleDateString() + ' ' + (new Date(item.Create_Date)).toLocaleTimeString()}
                            </td>
                            <td className="text-center">
                              <Button style={styles.mgl5} outline color="primary" size="sm" onClick={async (e) => await this.openUpdate(item)} >Cập nhật</Button>{' '}
                              <Button outline color="danger" size="sm" onClick={(e) => { this.openDelete(item) }}>Xoá</Button>{' '}

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
                field="Email"
                label="Email"
                value={this.state.Email}
                placeholder={"Email"}
                type={'email'}
                onChange={e => this.onChange("Email", e.target.value)}
              // rows="5"
              />
              <TextFieldGroup
                field="Address"
                label="Địa chỉ"
                value={this.state.Address}
                placeholder={"Địa chỉ"}
                type={'email'}
                onChange={e => this.onChange("Address", e.target.value)}
              // rows="5"
              />
              <TextFieldGroup
                field="Name"
                label="Tên"
                value={this.state.Name}
                placeholder={"Tên"}
                // error={errors.title}
                onChange={e => this.onChange("Name", e.target.value)}
              // rows="5"
              />

              <TextFieldGroup
                field="Password"
                label="Mật khẩu"
                value={this.state.Password}
                type={"password"}
                placeholder={"Mật khẩu"}
                readOnly={action == 'new' ? false : true}
                onChange={e => this.onChange("Password", e.target.value)}
              // rows="5"
              />

              <TextFieldGroup
                field="Code"
                label="Code"
                placeholder={"Code"}
                value={this.state.Code}
                // error={errors.title}
                onChange={e => this.onChange("Code", e.target.value)}
              // rows="5"
              />

              <TextFieldGroup
                field="UserName"
                label="Tên đăng nhập"
                placeholder={"Tên đăng nhập"}
                value={this.state.UserName}
                // error={errors.title}
                onChange={e => this.onChange("UserName", e.target.value)}
              // rows="5"
              />

              <TextFieldGroup
                field="Phone"
                label="Số điện thoại"
                value={this.state.Phone}
                placeholder={"Số điện thoại"}
                // error={errors.title}
                onChange={e => this.onChange("Phone", e.target.value)}
              // rows="5"
              />

              {/* <div>
                <label style={styles.flexLabel} htmlFor="tag">Giới tính:    </label>
                <select style={styles.flexOption} name="Gender" onChange={e => this.onChange("Gender", e.target.value)}>
                  <option value={this.state.Gender}>{this.state.Gender == '' ? ` - - - - - - - - - - ` : this.state.Gender}</option>
                  <option value={'Nam'}>Nam</option>
                  <option value={'Nữ'}>Nữ</option>
                </select>
              </div> */}

            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={e => { this.state.action === 'new' ? this.addUser() : this.updateUser() }} disabled={this.state.isLoading}>Save</Button>{' '}
              <Button color="secondary" onClick={e => { this.setState({ modalCom: !this.state.modalCom }) }}>Đóng</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalDelete} toggle={e => this.setState({ modalDelete: !this.state.modalDelete, delete: null })} className={this.props.className}>
            <ModalHeader toggle={e => this.setState({ modalDelete: !this.state.modalDelete, delete: null })}>{`Delete`}</ModalHeader>
            <ModalBody>
              <label htmlFor="tag">{`Do you want to delete user "${this.state.delete ? this.state.delete.Email : ''}" ?`}</label>
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


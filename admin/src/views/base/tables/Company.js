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
  CRow,
  CCol
} from '@coreui/react'

import 'moment-timezone';
import Constants from "./../../../contants/contants";
import TextFieldGroup from "../../../views/Common/TextFieldGroup";
import axios from 'axios'
import Pagination from '@material-ui/lab/Pagination';
import API_CONNECT from "../../../helpers/callAPI";

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      key: '',
      UserName: "",
      Password: "",
      keyDateCreate: new Date(),
      keyStatus: '',
      page: 1,
      itemsCount: 0,
      limit: 20,
      totalActive: 0,
      modalCom: false,
      updated: '',
      dataApi: [],
      action: 'new',
      Name: '',
      Email: '',
      Phone: '',
      Fax: 'Nam',
      Address: '',
      Website: '',
      Code: '',
      Status: '',
      image: "",
      image_show: "",
      image_update: "",
      modalDelete: false,
      delete: null,
      arrPagination: [],
      indexPage: 0,
      dataCompany: [],
      currentCompany: '',
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
    // this.setState({ key: key })

    if (key != '') {
      let d = []
      this.state.dataApi.map(val => {
        if ((val.Email.toLocaleUpperCase().includes(key.toLocaleUpperCase()) ||
          val.Name.toLocaleUpperCase().includes(key.toLocaleUpperCase()) ||
          val.Phone.toLocaleUpperCase().includes(key.toLocaleUpperCase()))) {

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

  toggleModal(key) {
    if (key == 'new') {
      this.setState({
        modalCom: !this.state.modalCom,
        action: key,
        Name: '',
        Email: '',
        Phone: '',
        Fax: '',
        Address: '',
        Website: '',
        Code: '',
        Status: '',
        username: '',
        password: '',
        image: '',
        image_show: '',
        image_update: ""
      })
    }
  }

  onChangeImage(e) {
    let files = e.target.files;
    let reader = new FileReader();
    this.setState({ image: files[0], image_update: files[0] })
    reader.readAsDataURL(files[0])
    reader.onload = (e) => {
      this.setState({ image_show: e.target.result })
    }
  }

  onChange(key, val) {
    this.setState({ [key]: val })
  }

  async addCompany() {
    const { Email, Name, Phone, Fax, Address, Website, Code, UserName, Password, image } = this.state

    if (Email == null || Email == ''
      || Name == null || Name == ''
      || Phone == null || Phone == ''
      || Address == null || Address == ''
      || UserName == null || UserName == ''
      || Password == null || Password == '') {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return
    }

    const form = new FormData();
    form.append("image", image);

    await API_CONNECT(Constants.UPLOAD_COMPANY, form, "", "POST")

    const body = {
      Name: Name,
      Email: Email,
      Phone: Phone,
      Fax: Fax,
      Address: Address,
      Website: Website,
      Code: Code,
      Image: image.name,
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.ADD_COMPANY,
      method: 'PUT',
      data: body
    });

    if (res.data.is_success == true) {
      this.getData();

      const bodyAddUser = {
        "Name": Name,
        "Email": Email,
        "Phone": Phone,
        "Address": Address,
        "Company_Id": res.data.data._id,
        "Role_Id": "65727849424b4a0698883ed5",
        "UserName": UserName,
        "Password": Password,
        "Code": res.data.data._id,
        "Status": "Actived"
      }

      await axios({
        baseURL: Constants.BASE_URL,
        url: Constants.ADD_USER,
        method: 'POST',
        data: bodyAddUser
      });

      this.setState({ modalCom: !this.state.modalCom })
    } else {
      alert(res.data.message);
      this.setState({ isLoading: false });
    }
  }

  openUpdate(item) {

    this.setState({
      modalCom: !this.state.modalCom,
      action: "update",
      Name: item.Name,
      Email: item.Email,
      Phone: item.Phone,
      Fax: item.Fax,
      Address: item.Address,
      Website: item.Website,
      Code: item._id,
      image: item.Logo,
      image_show: "",
      image_update: "",
      id: item['_id'],
      Status: item.Status
    })
  }

  async updateCompany() {
    const { Email, Name, Phone, Fax, Address, Website, image, image_update, Status } = this.state

    if (Email == null || Email == ''
      || Name == null || Name == ''
      || Phone == null || Phone == ''
      || Address == null || Address == '') {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return
    }

    if (image_update != "") {
      const form = new FormData();
      form.append("image", image_update);

      await API_CONNECT(Constants.UPLOAD_COMPANY, form, "", "POST")
    }

    const body = {
      Name: Name,
      Email: Email,
      Phone: Phone,
      Fax: Fax,
      Image: image_update == "" ? image : image_update.name,
      Address: Address,
      Website: Website,
      Code: this.state.id,
      Status: Status,
      id: this.state.id
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.UPDATE_COMPANY,
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
      url: Constants.DELETE_COMPANY,
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

  getBadge(status) {
    switch (status) {
      case 'Actived': return 'success'
      case 'Inactive': return 'secondary'
      case 'Locked': return 'warning'
      case 'Deactived': return 'danger'
      default: return 'primary'
    }
  }

  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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
      keyEmail: '',
      keyPhone: '',
      keyFax: '',
      keyAddress: '',
      keyWebsite: '',
      keyCode: '',
      keyCompany: '',
      keyDateCreate: new Date(),
      keyStatus: ''
    }, () => {
      this.searchKey();
    });
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
                          <CCol sm="12" lg="4">
                            <div>
                              <Input style={styles.searchInput} onChange={(e) => {
                                this.actionSearch(e, "key");
                              }} name="key" value={key} placeholder="Từ khóa" />
                            </div>
                          </CCol>
                          <CCol sm="12" lg="4">

                          </CCol>
                          <CCol sm="12" lg="4">
                            <Button color="primary" style={{ width: '100%', marginTop: 5 }} size="sm" onClick={e => { this.resetSearch() }}>Làm mới tìm kiếm</Button>
                          </CCol>
                        </CRow>
                      </CCol>
                      <CCol sm="12" lg="12">
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
            </Col>
          </Row>

          <Modal size='xl' isOpen={this.state.modalCom} className={this.props.className}>
            <ModalHeader>{this.state.action == 'new' ? `Tạo mới` : `Cập nhật`}</ModalHeader>
            <ModalBody>
              <CRow>
                <CCol sm="12" lg="6">
                  <TextFieldGroup
                    field="Email"
                    label="Email"
                    value={this.state.Email}
                    type={"email"}
                    placeholder={"Email"}
                    onChange={e => this.onChange("Email", e.target.value)}
                  />

                  <TextFieldGroup
                    field="Name"
                    label="Tên công ty"
                    value={this.state.Name}
                    placeholder={"Tên công ty"}
                    onChange={e => this.onChange("Name", e.target.value)}
                  />

                  <TextFieldGroup
                    field="UserName"
                    label="Tên đăng nhập"
                    value={this.state.UserName}
                    placeholder={"Tên đăng nhập"}
                    onChange={e => this.onChange("UserName", e.target.value)}
                  />

                  <TextFieldGroup
                    field="Password"
                    label="Mật khẩu"
                    type={"password"}
                    value={this.state.Password}
                    placeholder={"Mật khẩu"}
                    onChange={e => this.onChange("Password", e.target.value)}
                  />

                  <TextFieldGroup
                    field="Phone"
                    label="Số điện thoại"
                    value={this.state.Phone}
                    placeholder={"Số điện thoại"}
                    onChange={e => this.onChange("Phone", e.target.value)}
                  />

                  <TextFieldGroup
                    field="Fax"
                    label="Fax"
                    value={this.state.Fax}
                    placeholder={"Fax"}
                    onChange={e => this.onChange("Fax", e.target.value)}
                  />

                  <TextFieldGroup
                    field="Address"
                    label="Địa chỉ"
                    value={this.state.Address}
                    placeholder={"Địa chỉ"}
                    onChange={e => this.onChange("Address", e.target.value)}
                  />

                  <TextFieldGroup
                    field="Website"
                    label="Website"
                    value={this.state.Website}
                    placeholder={"Website"}
                    onChange={e => this.onChange("Website", e.target.value)}
                  />
                </CCol>
                <CCol sm="12" lg="6">
                  <TextFieldGroup
                    field="image"
                    label="Ảnh thương hiệu"
                    type={"file"}
                    onChange={e => { this.onChangeImage(e) }}
                    onClick={(e) => { e.target.value = null; this.setState({ image_show: "" }) }}
                  />
                  {
                    this.state.image == "" ? "" :
                      <img width="250" height="300" src={
                        this.state.image_show == "" ? `${Constants.BASE_URL}/public/logo_company/${this.state.image}` : this.state.image_show} style={{ marginBottom: 20 }} />
                  }
                </CCol>
              </CRow>

            </ModalBody>

            <ModalFooter>
              <Button color="primary" onClick={e => { this.state.action === 'new' ? this.addCompany() : this.updateCompany() }} disabled={this.state.isLoading}>Lưu</Button>{' '}
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
        </div >
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
  },
  mgl5: {
    marginBottom: '5px'
  }
}

export default Company;

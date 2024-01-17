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
import TextFieldGroup from "../../../views/Common/TextFieldGroup";
import axios from 'axios'
let headers = new Headers();
const auth = localStorage.getItem('auth');
headers.append('Authorization', 'Bearer ' + auth);
headers.append('Content-Type', 'application/json');
class PackageSale extends Component {
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
      Company_Id: "",
      link_shop: "",
      link_shopee: "",
      link_lazada: "",
      link_tiki: "",
      Status: "Actived",
      modalDelete: false,
      delete: null,
      dataCompany: [],
      currentCompany: '',
      arrPagination: [],
      indexPage: 0,
      company_id: localStorage.getItem('user'),
      role: localStorage.getItem('role')
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
    const { company_id, role } = this.state;
    var id = JSON.parse(company_id);

    this.setState({ isLoading: true });
    if (role == 'ADMIN' || role == 'ADMINSALE') {
      var res = await axios({
        baseURL: Constants.BASE_URL,
        url: Constants.LIST_LINK,
        method: 'POST'
      });
    } else {
      var res = await axios({
        baseURL: Constants.BASE_URL,
        url: Constants.LIST_LINK,
        method: 'POST',
        data: {
          condition: {
            "Company_Id": id.company_id
          }
        }
      });
    }

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
        if (val.link_shop.toLocaleUpperCase().includes(key.toLocaleUpperCase())) {
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
    await this.getCompanyData()
    if (key == 'new') {
      this.setState({
        modalCom: !this.state.modalCom,
        action: key,
        Company_Id: "",
        link_shop: "",
        link_shopee: "",
        link_lazada: "",
        link_tiki: "",
      })
    }
  }

  onChange(key, val) {
    this.setState({ [key]: val })
  }

  async addPackageSale() {
    const { Company_Id, link_shop, link_shopee, link_lazada, link_tiki } = this.state

    if (link_shop == null || link_shop == '') {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return
    }

    const body = {
      Company_Id: Company_Id,
      link_shop: link_shop,
      link_shopee: link_shopee,
      link_lazada: link_lazada,
      link_tiki: link_tiki,
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.ADD_LINK,
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
    await this.getCompanyData(item.Company_Id)
    this.setState({
      modalCom: !this.state.modalCom,
      action: "update",
      Company_Id: item.Company_Id,
      link_shop: item.link_shop,
      link_lazada: item.link_lazada,
      link_shopee: item.link_shopee,
      link_tiki: item.link_tiki,
      id: item['_id'],
      Status: item.Status
    })
  }

  async updatePackageSale() {
    const { Company_Id, link_shop, link_shopee, link_lazada, link_tiki, Status, company_id, role } = this.state

    var id = JSON.parse(company_id);

    if (link_shop == null || link_shop == '') {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return
    }

    const body = {
      Company_Id: role == 'ADMIN' || role == 'ADMINSALE' ? Company_Id : id.company_id,
      link_shop: link_shop,
      link_shopee: link_shopee,
      link_lazada: link_lazada,
      link_tiki: link_tiki,
      id: this.state.id,
      Status: Status
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.UPDATE_LINK,
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
      url: Constants.DELETE_LINK,
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

  render() {
    const { data, key, dataCompany,
      currentCompany, arrPagination, indexPage, role } = this.state;
    if (!this.state.isLoading) {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <p style={styles.success}>{this.state.updated}</p>
              <p style={styles.danger}>{this.state.deleted}</p>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> LINK MANAGER (Total: {this.state.data != undefined || this.state.data != null ?
                    this.state.data.length : 0}, Active: {this.state.totalActive}, Page: {this.state.indexPage + 1})
                  <div style={styles.tags}>
                    <div>
                      <Input style={styles.searchInput} onChange={(e) => this.searchKey(e.target.value)} name="key" value={key} placeholder="Search" />
                      {
                        role == 'ADMIN' || role == 'ADMINSALE' ?
                          <Button outline color="primary" style={styles.floatRight} size="sm" onClick={e => this.toggleModal("new")}>
                            Add
                          </Button> : ""
                      }

                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                    <thead className="thead-light">
                      <tr>
                        <th className="text-center">Company ID</th>
                        <th className="text-center">Link Shop</th>
                        <th className="text-center">Link Shopee</th>
                        <th className="text-center">Link Lazada</th>
                        <th className="text-center">Link Tiki</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        data != undefined ?
                          data.map((item, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-center">{item.Company_Id}</td>
                                <td className="text-center">{item.link_shop}</td>
                                <td className="text-center">{item.link_shopee}</td>
                                <td className="text-center">{item.link_lazada}</td>
                                <td className="text-center">{item.link_tiki}</td>
                                <td className="text-center">
                                  <Button outline color="primary" size="sm" onClick={(e) => this.openUpdate(item)} >Cập nhật</Button>{' '}
                                  {
                                    role == 'ADMIN' || role == 'ADMINSALE' ?
                                      <Button outline color="danger" size="sm" onClick={(e) => { this.openDelete(item) }}>
                                        Delete
                                      </Button> : ""
                                  }
                                </td>
                              </tr>
                            );
                          }) : ""
                      }
                    </tbody>
                  </table>
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
                field="link_shop"
                label="Link shop"
                value={this.state.link_shop}
                placeholder={"Link Shop"}
                // error={errors.title}
                onChange={e => this.onChange("link_shop", e.target.value)}
              // rows="5"
              />

              <TextFieldGroup
                field="link_shopee"
                label="Link Shopee"
                value={this.state.link_shopee}
                placeholder={"Link Shopee"}
                // error={errors.title}
                onChange={e => this.onChange("link_shopee", e.target.value)}
              // rows="5"
              />

              <TextFieldGroup
                field="link_lazada"
                label="Link Lazada"
                value={this.state.link_lazada}
                placeholder={"Link Lazada"}
                // error={errors.title}
                onChange={e => this.onChange("link_lazada", e.target.value)}
              // rows="5"
              />

              <TextFieldGroup
                field="link_tiki"
                label="Link Tiki"
                value={this.state.link_tiki}
                placeholder={"Link Tiki"}
                // error={errors.title}
                onChange={e => this.onChange("link_tiki", e.target.value)}
              // rows="5"
              />

              {/* {
                action == 'new' ? "" : <div>
                  <label style={styles.flexLabel} htmlFor="tag">Status:</label>
                  <select style={styles.flexOption} name="Status" onChange={e => this.onChange("Status", e.target.value)}>
                    <option value={this.state.Status}>{this.state.Status == '' ? ` - - - - - - - - - - ` : this.state.Status}</option>
                    <option value={'Actived'}>Actived</option>
                    <option value={'Locked'}>Locked</option>
                    <option value={'Deactived'}>Deactived</option>
                  </select>
                </div>
              } */}
              {
                role == 'ADMIN' || role == 'ADMINSALE' ?
                  <div>
                    <label style={styles.flexLabel} htmlFor="tag">Company:    </label>
                    <select style={styles.flexOption} name="Company_Id" onChange={e => this.onChange("Company_Id", e.target.value)}>
                      <option value={this.state.Company_Id}>-----</option>
                      {
                        dataCompany.map((item, i) => {
                          if (item.Name == currentCompany) {
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
                  </div> : ""
              }

            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={e => { this.state.action === 'new' ? this.addPackageSale() : this.updatePackageSale() }} disabled={this.state.isLoading}>Lưu</Button>{' '}
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
    marginBottom: '5px'
  }
}

export default PackageSale;

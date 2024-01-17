import React, { Component } from 'react';
import CIcon from '@coreui/icons-react'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Input,
  ModalHeader, ModalBody, ModalFooter, Modal,
} from 'reactstrap';

import {
  CButton,
  CRow, CCol
} from '@coreui/react'

import Pagination from '@material-ui/lab/Pagination';
import 'moment-timezone';
import ConstantApp from "../../../../../contants/contants";
import TextFieldGroup from "../../../../Common/TextFieldGroup";
import { css } from "@emotion/react";
import "react-datepicker/dist/react-datepicker.css";
import DotLoader from "react-spinners/DotLoader";
import API_CONNECT from "../../../../../helpers/callAPI";

class SubType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      key: '',
      modalCom: false,
      dataApi: [],
      hidden: false,
      action: 'new',
      products: [],
      vi: "",
      image: "",
      id: '',
      modalDelete: false,
      delete: null,
      arrPagination: [],
      indexPage: 0,
      token: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      companyid: localStorage.getItem('company_id'),
      isLoading: false
    };
  }
  async componentDidMount() {
    this.getData()

    let arr = JSON.parse(localStorage.getItem('url'));
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].url == window.location.hash) {
        if (arr[i].isHidden == true) {
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

    this.setState({ arrPagination: arrTotal, data: arrTotal[0] });
  }

  getData = async () => {
    const { companyid } = this.state;
    this.setState({ isLoading: true });

    const res_brand = await API_CONNECT(
      `${ConstantApp.GET_LIST_TYPE}?company_id=${companyid}`, {}, "", "GET")

    let val = res_brand.data;

    this.pagination(val);
    this.setState({ dataApi: val, isLoading: false })
  }

  async toggleModal(key) {
    if (key == 'new') {
      this.setState({
        modalCom: !this.state.modalCom,
        action: key,
        vi: '',
        image: ''
      })
    }
  }

  onChange(key, val) {
    this.setState({ [key]: val })
  }

  formatDate(date) {
    const d = date.getDate()
    const m = date.getMonth() + 1
    const y = date.getFullYear()
    let newD = ''
    let newM = ''

    if (d < 10)
      newD = `0${d}`
    else
      newD = d
    if (m < 10)
      newM = `0${m}`
    else
      newM = m

    return `${newD}-${newM}-${y}`
  }

  async addType() {
    const { vi, image, companyid } = this.state

    if (image == null || image == ''
      || vi == null || vi == '') {
      alert("Vui lòng nhập đủ trường dữ liệu");
      return
    }

    const body = {
      vi: vi,
      image: image,
      company_id: companyid
    }

    this.setState({ isLoading: true });
    const res_add = await API_CONNECT(
      ConstantApp.ADD_TYPE, body, "", "POST")

    if (res_add.status == 200) {

      this.getData()

      this.setState({ modalCom: !this.state.modalCom })
    } else {
      alert("Thêm màu thất bại");
      this.setState({ isLoading: false });
    }
  }

  async openUpdate(item) {
    this.setState({
      modalCom: !this.state.modalCom,
      action: "update",
      vi: item.vi,
      image: item.image,
      id: item['_id'],
    })
  }

  async updateBrand() {
    const { vi, image } = this.state

    if (image == null || image == ''
      || vi == null || vi == '') {
      alert("Vui lòng nhập đủ trường dữ liệu");
      return
    }

    const body = {
      vi: vi,
      image: image,
      id: this.state.id
    }

    this.setState({ isLoading: true });
    const res = await API_CONNECT(
      ConstantApp.UPDATE_TYPE, body, "", "POST")

    if (res.status == 200) {

      this.getData()

      this.setState({ modalCom: !this.state.modalCom })
    } else {
      alert("Cập nhật thất bại");
      this.setState({ isLoading: false });
    }
  }

  openDelete = (item) => {
    this.setState({
      modalDelete: !this.state.modalDelete,
      id: item._id
    })
  }

  async delete() {
    this.setState({ isLoading: true });
    const res = await API_CONNECT(
      ConstantApp.DELETE_TYPE, {
        "id": this.state.id
      }, "", "POST")

    if (res.status == 200) {
      this.getData()
      this.setState({ modalDelete: !this.state.modalDelete, delete: null })
    } else {
      alert("Xóa sản phẩm thất bại");
      this.setState({ isLoading: false });
    }

  }

  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  searchKey() {
    const { indexPage, key } = this.state;
    // this.setState({ key: key })

    if (key != '') {
      let d = []
      this.state.dataApi.map(val => {
        if (val.name.toLocaleUpperCase().includes(key.toLocaleUpperCase())) {

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
      key: ''
    }, () => {
      this.searchKey();
    });
  }

  render() {
    const { data, arrPagination, key,vi, image } = this.state;
    if (!this.state.isLoading) {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Danh sách danh mục
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
                            <CButton color="primary" style={{ width: '100%', marginTop: 5 }} size="sm" onClick={e => { this.resetSearch() }}>Làm mới tìm kiếm</CButton>
                          </CCol>
                        </CRow>
                      </CCol>
                      <CCol sm="12" lg="12">
                        <CButton outline color="primary" style={styles.floatRight} size="sm" onClick={async e => await this.toggleModal("new")}>Thêm</CButton>
                      </CCol>
                    </CRow>

                  </div>
                </CardHeader>
                <CardBody>

                  <table ble className="table table-hover table-outline mb-0 d-none d-sm-table">
                    <thead className="thead-light">
                      <tr>
                        <th className="text-center">STT.</th>
                        <th className="text-center">Tên danh mục</th>
                        <th className="text-center">Hình ảnh</th>
                        <th className="text-center">#</th>
                      </tr>
                    </thead>
                    <tbody>
                      <td colSpan="10" hidden={this.state.hidden} className="text-center">Không tìm thấy dữ liệu</td>
                      {
                        data != undefined ?
                          data.map((item, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-center">{item.vi}</td>
                                <td className="text-center">
                                  <img width="80" height="80" src={item.image} />
                                </td>
                                <td className="text-center">
                                  <CButton style={styles.mgl5} outline color="primary" size="sm" onClick={async (e) => await this.openUpdate(item)} >
                                    <CIcon name="cilPencil" />
                                  </CButton>
                                  <CButton outline color="danger" size="sm" onClick={(e) => { this.openDelete(item) }}>
                                    <CIcon name="cilTrash" />
                                  </CButton>
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
              <TextFieldGroup
                field="vi"
                label="Tên"
                value={vi}
                placeholder={"Tên"}
                onChange={e => this.onChange("vi", e.target.value)}
              />
              <TextFieldGroup
                field="image"
                label="Hình ảnh"
                value={image}
                placeholder={"Hình ảnh"}
                onChange={e => this.onChange("image", e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <CButton color="primary" onClick={e => { this.state.action === 'new' ? this.addType() : this.updateBrand() }} disabled={this.state.isLoading}>Save</CButton>{' '}
              <CButton color="secondary" onClick={e => this.toggleModal("new")}>Cancel</CButton>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalDelete} toggle={e => this.setState({ modalDelete: !this.state.modalDelete, delete: null })} className={this.props.className}>
            <ModalHeader toggle={e => this.setState({ modalDelete: !this.state.modalDelete, delete: null })}>{`Delete`}</ModalHeader>
            <ModalBody>
              <label htmlFor="tag">{`Xác nhận xóa !!!`}</label>
            </ModalBody>
            <ModalFooter>
              <CButton color="primary" onClick={e => this.delete()} disabled={this.state.isLoading}>Delete</CButton>{' '}
              <CButton color="secondary" onClick={e => this.setState({ modalDelete: !this.state.modalDelete, delete: null })}>Cancel</CButton>
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
    margin: '5px'
  },
  tags: {
    float: "right",
    marginRight: "5px"
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
}

export default SubType;

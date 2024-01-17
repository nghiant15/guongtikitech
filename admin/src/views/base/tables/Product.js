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
  CCol,
  CLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import CreatableSelect from 'react-select/creatable';
import 'moment-timezone';
import Constants from "./../../../contants/contants";
import TextFieldGroup from "../../../views/Common/TextFieldGroup";
import axios from 'axios'
import Pagination from '@material-ui/lab/Pagination';
import API_CONNECT from "../../../../src/helpers/callAPI";
import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

let headers = new Headers();
const auth = localStorage.getItem('auth');
headers.append('Authorization', 'Bearer ' + auth);
headers.append('Content-Type', 'application/json');
class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      key: '',
      page: 1,
      itemsCount: 0,
      limit: 20,
      modalCom: false,
      updated: '',
      dataApi: [],
      action: 'new',
      name: "",
      shop_id: "",
      category_id: "",
      image: "",
      image_update: "",
      image_show: "",
      link: "",
      price: "",
      code: "",
      sku_code: "",
      brand_id: "",
      weight: "",
      info_product: "",
      how_to_use: "",
      description: "",
      description_brand: "",

      //thông tin seo
      title: "",
      author: "",
      keyword: "",
      description_SEO: "",

      modalDelete: false,
      delete: null,
      arrPagination: [],
      indexPage: 0,
      dataCompany: [],
      currentCompany: '',
      arrOptionShop: [],
      objectValueShop: {},
      arrOptionBrand: [],
      objectValueBrand: {},
      arrOptionCategory: [],
      objectValueCategory: {},
      token: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      role: localStorage.getItem('role'),
      hidden: false
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


  pagination(dataApi) {
    var i, j, temparray, chunk = 5;
    var arrTotal = [];
    for (i = 0, j = dataApi.length; i < j; i += chunk) {
      temparray = dataApi.slice(i, i + chunk);
      arrTotal.push(temparray);
    }

    if (arrTotal.length == 0) {
      this.setState({ hidden: false })
    } else {
      this.setState({ hidden: true })
    }

    this.setState({ arrPagination: arrTotal, data: arrTotal[this.state.indexPage] });
  }

  getData = async () => {
    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.LIST_PRODUCT_HARDWARE,
      method: 'POST',
      headers: this.state.token
    });

    let data = res.data.data
    this.pagination(data);
    this.setState({ dataApi: data });

    this.setState({ isLoading: false });
  }

  handleChange = (newValue, actionMeta) => {
    this.setState({ objectValueShop: newValue, shop_id: newValue.value })
    console.log(newValue);
  };

  handleChange_Brand = (newValue, actionMeta) => {
    this.setState({ objectValueBrand: newValue, brand_id: newValue.value })
    console.log(newValue);
  };

  handleChange_Category = (newValue, actionMeta) => {
    this.setState({ objectValueCategory: newValue, category_id: newValue.value })
    console.log(newValue);
  };

  searchKey() {
    const { indexPage, key, keyStatus } = this.state;
    // this.setState({ key: key })

    if (key != '' || keyStatus != '') {
      let d = []
      this.state.dataApi.map(val => {
        if ((val.name.toLocaleUpperCase().includes(key.toLocaleUpperCase()))) {

          d.push(val)
        }
      })

      this.setState({ data: d })
    } else {

      this.setState({ data: this.state.arrPagination[indexPage] })
    }
  }

  toggleModal(key) {
    if (key == 'new') {
      this.setState({
        modalCom: !this.state.modalCom,
        action: key,
        name: "",
        shop_id: "",
        category_id: "",
        image: "",
        image_show: "",
        image_update: "",
        link: "",
        price: "",
        code: "",
        sku_code: "",
        brand_id: "",
        weight: "",
        info_product: "",
        how_to_use: "",
        description: "",
        description_brand: "",
      }, async () => {
        const { arrOptionShop, arrOptionBrand, arrOptionCategory } = this.state;

        if (arrOptionShop.length == 0 || arrOptionBrand.length == 0 || arrOptionCategory.length == 0) {
          const res_shop = await API_CONNECT(Constants.GET_SHOP, {}, this.state.token, "GET")

          const res_brand = await API_CONNECT(Constants.LIST_BRAND_HARDWARE, {}, this.state.token, "POST")

          const res_category = await API_CONNECT(Constants.LIST_CATEGORY, {}, this.state.token, "POST")

          let data_shop = res_shop.data
          let data_brand = res_brand.data
          let data_category = res_category.data

          let arrTempOptionShop = [];
          for (let i = 0; i < data_shop.length; i++) {
            arrTempOptionShop.push({
              value: data_shop[i]._id, label: data_shop[i].Name
            })
          }

          let arrTempOptionBrand = [];
          for (let i = 0; i < data_brand.length; i++) {
            arrTempOptionBrand.push({
              value: data_brand[i]._id, label: data_brand[i].name
            })
          }

          let arrTempOptionCategory = [];
          for (let i = 0; i < data_category.length; i++) {
            arrTempOptionCategory.push({
              value: data_category[i]._id, label: data_category[i].name
            })
          }

          this.setState({ arrOptionShop: arrTempOptionShop, arrOptionBrand: arrTempOptionBrand, arrOptionCategory: arrTempOptionCategory });
        }
      })
    }
  }

  onChange(key, val) {
    this.setState({ [key]: val })
  }

  async addProduct() {
    const { name, shop_id, image, link, price, code, brand_id, sku_code, category_id, weight, info_product, how_to_use, description, description_brand } = this.state

    if (name == null || name == ''
      || link == null || link == ''
      || brand_id == null || brand_id == '') {
      alert("Vui lòng nhập đầy đủ trường");
      return
    }

    const form = new FormData();
    form.append("image", image);

    await API_CONNECT(Constants.UPLOAD_PRODUCT, form, "", "POST")

    const body = {
      name: name,
      shop_id: shop_id,
      image: image.name,
      link: link,
      price: price,
      code: code,
      sku_code: sku_code,
      brand_id: brand_id,
      category_id: category_id,
      weight: weight,
      info_product: info_product,
      how_to_use: how_to_use,
      description: description,
      description_brand: description_brand,
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.ADD_PRODUCT_HARDWARE,
      method: 'POST',
      data: body,
      headers: this.state.token
    });

    if (res.data.is_success == true) {
      this.getData();
      this.setState({ modalCom: !this.state.modalCom })
    } else {
      alert(res.data.message);
      this.setState({ isLoading: false });
    }
  }

  openUpdate(item) {
    const { arrOptionBrand, arrOptionShop } = this.state;
    let filterBrand = arrOptionBrand.filter(v => v.value == item.brand_id);
    let filterShop = arrOptionShop.filter(v => v.value == item.shop_id);

    this.setState({
      modalCom: !this.state.modalCom,
      action: "update",
      name: item.name,
      shop_id: item.shop_id,
      image: item.image,
      image_show: "",
      image_update: "",
      link: item.link,
      objectValueBrand: filterBrand[0],
      objectValueShop: filterShop[0],
      objectValueBrand: { value: item.brand_id._id, label: item.brand_id.name },
      objectValueCategory: { value: item.category_id._id, label: item.category_id.name },
      price: item.price,
      code: item.code,
      sku_code: item.sku_code,
      brand_id: item.brand_id,
      category_id: item.category_id,
      weight: item.weight,
      info_product: item.info_product,
      how_to_use: item.how_to_use,
      description: item.description,
      description_brand: item.description_brand,
      id: item['_id'],
    }, async () => {
      const { arrOptionShop, arrOptionBrand, arrOptionCategory } = this.state;

      if (arrOptionShop.length == 0 || arrOptionBrand.length == 0 || arrOptionCategory.length == 0) {
        const res_shop = await API_CONNECT(Constants.GET_SHOP, {}, this.state.token, "GET")

        const res_brand = await API_CONNECT(Constants.LIST_BRAND_HARDWARE, {}, this.state.token, "POST")

        const res_category = await API_CONNECT(Constants.LIST_CATEGORY, {}, this.state.token, "POST")

        let data_shop = res_shop.data
        let data_brand = res_brand.data
        let data_category = res_category.data

        let arrTempOptionShop = [];
        for (let i = 0; i < data_shop.length; i++) {
          arrTempOptionShop.push({
            value: data_shop[i]._id, label: data_shop[i].Name
          })
        }

        let arrTempOptionBrand = [];
        for (let i = 0; i < data_brand.length; i++) {
          arrTempOptionBrand.push({
            value: data_brand[i]._id, label: data_brand[i].name
          })
        }

        let arrTempOptionCategory = [];
        for (let i = 0; i < data_category.length; i++) {
          arrTempOptionCategory.push({
            value: data_category[i]._id, label: data_category[i].name
          })
        }

        this.setState({ arrOptionShop: arrTempOptionShop, arrOptionBrand: arrTempOptionBrand, arrOptionCategory: arrTempOptionCategory });
      }
    })
  }

  async updateProduct() {
    const { name, shop_id, image, image_update, link, price, code, brand_id, sku_code, category_id, weight, info_product, how_to_use, description, description_brand } = this.state

    if (name == null || name == ''
      || link == null || link == ''
      || brand_id == null || brand_id == '') {
      alert("Vui lòng nhập đầy đủ trường");
      return
    }

    if (image_update != "") {
      const form = new FormData();
      form.append("image", image_update);

      await API_CONNECT(Constants.UPLOAD_PRODUCT, form, "", "POST")
    }

    const body = {
      "name": name,
      "shop_id": shop_id,
      "image": image_update == "" ? image : image_update.name,
      "link": link,
      "price": price,
      "code": code,
      "sku_code": sku_code,
      "brand_id": brand_id,
      "category_id": category_id,
      "weight": weight,
      "info_product": info_product,
      "how_to_use": how_to_use,
      "description": description,
      "description_brand": description_brand,
      id: this.state.id
    }

    this.setState({ isLoading: true });
    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.UPDATE_PRODUCT_HARDWARE,
      method: 'POST',
      data: body,
      headers: this.state.token
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
      url: Constants.DELETE_PRODUCT_HARDWARE,
      method: 'POST',
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

  onChangeImage(e) {
    let files = e.target.files;
    let reader = new FileReader();
    this.setState({ image: files[0], image_update: files[0] })
    reader.readAsDataURL(files[0])
    reader.onload = (e) => {
      this.setState({ image_show: e.target.result })
    }
  }

  render() {
    const { data, key, objectValueBrand, objectValueShop, objectValueCategory, role,
      arrOptionBrand, arrOptionShop, arrOptionCategory, arrPagination, hidden } = this.state;
    if (!this.state.isLoading) {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <p style={styles.success}>{this.state.updated}</p>
              <p style={styles.danger}>{this.state.deleted}</p>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Danh sách sản phẩm
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
                        <th className="text-center">Tên sản phẩm</th>
                        <th className="text-center">Mã sku</th>
                        <th className="text-center">Mã barcode</th>
                        {
                          role == "COMPANY" || role == "SALES" ? "" :
                            <th className="text-center">Tên shop</th>
                        }
                        <th className="text-center">Hình ảnh</th>
                        <th className="text-center">Đường dẫn</th>
                        <th className="text-center">Thương hiệu</th>
                        <th className="text-center">Giá</th>
                        <th className="text-center">#</th>

                      </tr>
                    </thead>
                    <tbody>
                      <td colSpan="9" hidden={hidden} className="text-center">Không có dữ liệu</td>
                      {
                        data != undefined ?
                          data.map((item, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-center">{item.name}</td>
                                <td className="text-center">{item.code}</td>
                                <td className="text-center">{item.sku_code}</td>
                                {
                                  role == "COMPANY" || role == "SALES" ? "" :
                                    <td className="text-center">
                                      {item.shop_id.Name}
                                    </td>
                                }
                                <td className="text-center">
                                  {
                                    item.image == "" || item.image == null ?
                                      <img src={"https://www.chanchao.com.tw/VietnamPrintPack/images/default.jpg"} width={"60px"} height={"60px"} /> :
                                      <img src={`${Constants.BASE_URL}/public/image_product/${item.image}`} width={"60px"} height={"60px"} />
                                  }
                                </td>
                                <td className="text-center">
                                  <a href={item.link} target="_blank">
                                    {item.link}
                                  </a>
                                </td>
                                <td className="text-center">
                                  {item.brand_id.name}
                                </td>
                                <td className="text-center">{item.price}</td>
                                <td className="text-center">
                                  <Button outline color="primary" size="sm" onClick={(e) => this.openUpdate(item)}><CIcon name="cil-pencil" /></Button>
                                  <Button outline color="danger" size="sm" onClick={(e) => { this.openDelete(item) }}><CIcon name="cil-trash" /></Button>
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
                <CCol md="6" lg="6" sm="12" xm="12" lx="6">
                  <TextFieldGroup
                    field="name"
                    label="Tên sản phẩm"
                    value={this.state.name}
                    placeholder={"Tên sản phẩm"}
                    // error={errors.title}
                    onChange={e => this.onChange("name", e.target.value)}
                  // rows="5"
                  />

                  <TextFieldGroup
                    field="code"
                    label="Mã sku"
                    value={this.state.code}
                    placeholder={"Mã sản phẩm"}
                    // error={errors.title}
                    onChange={e => this.onChange("code", e.target.value)}
                  // rows="5"
                  />

                  <TextFieldGroup
                    field="sku_code"
                    label="Mã barcode"
                    value={this.state.sku_code}
                    placeholder={"Mã sku"}
                    // error={errors.title}
                    onChange={e => this.onChange("sku_code", e.target.value)}
                  // rows="5"
                  />

                  {
                    role == "COMPANY" || role == "SALES" ?
                      <div>
                        <CLabel>Cửa hàng:</CLabel>
                        <CreatableSelect
                          isClearable
                          onChange={this.handleChange}
                          value={objectValueShop}
                          // onInputChange={this.handleInputChange}
                          options={arrOptionShop}
                        /></div> : ""

                  }

                  <CLabel>Thương hiệu:</CLabel>
                  <CreatableSelect
                    isClearable
                    onChange={this.handleChange_Brand}
                    value={objectValueBrand}
                    // onInputChange={this.handleInputChange}
                    options={arrOptionBrand}
                  />

                  <CLabel>Danh mục:</CLabel>
                  <CreatableSelect
                    isClearable
                    onChange={this.handleChange_Category}
                    value={objectValueCategory}
                    // onInputChange={this.handleInputChange}
                    options={arrOptionCategory}
                  />

                  <TextFieldGroup
                    field="image"
                    label="Ảnh sản phẩm"
                    type={"file"}
                    onChange={e => { this.onChangeImage(e) }}
                    onClick={(e) => { e.target.value = null; this.setState({ image_show: "" }) }}
                  />
                  {
                    this.state.image == "" ? "" :
                      <img width="250" height="300" src={
                        this.state.image_show == "" ? `${Constants.BASE_URL}/public/image_product/${this.state.image}` : this.state.image_show} style={{ marginBottom: 20 }} />
                  }


                  <TextFieldGroup
                    field="link"
                    label="Đường dẫn"
                    value={this.state.link}
                    placeholder={"Đường dẫn"}
                    // error={errors.title}
                    onChange={e => this.onChange("link", e.target.value)}
                  // rows="5"
                  />

                  <TextFieldGroup
                    field="price"
                    label="Gía"
                    value={this.state.price}
                    placeholder={"Giá"}
                    // error={errors.title}
                    onChange={e => this.onChange("price", e.target.value)}
                  // rows="5"
                  />
                </CCol>
                <CCol md="6" lg="6" sm="12" xm="12" lx="6">
                  <label className="control-label">Mô tả</label>

                  <CKEditor
                    editor={ClassicEditor}
                    data={this.state.description}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      this.setState({ description: data })
                    }}
                  />

                  <br />
                  <label className="control-label">Mô tả thương hiệu</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={this.state.description_brand}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      this.setState({ description_brand: data })
                    }}
                  />

                  <br />

                  <label className="control-label">Thông tin sản phẩm</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={this.state.info_product}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      this.setState({ info_product: data })
                    }}
                  />

                  <br />

                  <label className="control-label">Chất liệu và cách sử dụng</label>
                  <CKEditor
                    editor={ClassicEditor}
                    row="5"
                    data={this.state.how_to_use}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      this.setState({ how_to_use: data })
                    }}
                  />
                </CCol>
              </CRow>
            </ModalBody>

            <ModalFooter>
              <Button color="primary" onClick={e => { this.state.action === 'new' ? this.addProduct() : this.updateProduct() }} disabled={this.state.isLoading}>Lưu</Button>{' '}
              <Button color="secondary" onClick={e => { this.setState({ modalCom: !this.state.modalCom }) }}>Đóng</Button>
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
  },
  mgl5: {
    marginBottom: '5px'
  }
}

export default Product;

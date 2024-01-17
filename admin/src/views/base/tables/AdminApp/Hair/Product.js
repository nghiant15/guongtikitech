import React, { Component } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form
} from "reactstrap";
import "moment-timezone";
import ConstantApp from "../../../../../contants/contants";
import TextFieldGroup from "../../../../Common/TextFieldGroup";
import API_CONNECT from "../../../../../helpers/callAPI";
import Pagination from '@material-ui/lab/Pagination';
import chroma from 'chroma-js';
import Select from 'react-select';
import CIcon from '@coreui/icons-react'
import {
  CButton,
} from '@coreui/react'
import DotLoader from "react-spinners/DotLoader";
import { css } from "@emotion/react";

let headers = new Headers();
const auth = localStorage.getItem("auth");
headers.append("Authorization", "Bearer " + auth);


const dot = (color = '#ccc') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.hex);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
          ? data.hex
          : isFocused
            ? color.alpha(0.1).css()
            : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.hex,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled && (isSelected ? data.hex : color.alpha(0.3).css()),
      },
    };
  },
  input: styles => ({ ...styles, ...dot() }),
  placeholder: styles => ({ ...styles, ...dot() }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.hex) }),
};

class ProductHair extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      categories: [],
      addresses: [],
      title: "",
      image: "",
      description: "",
      category: "",
      url: "",
      isActive100: false,
      isLoading: false,
      errors: { },
      action: "",
      brands: [],
      types: [],
      brand: null,
      type: null,
      productID: "",
      modalDelete: false,
      delete: null,
      auth: localStorage.getItem('auth'),
      companyid: localStorage.getItem('company_id'),
      colors: [],
      color: null,
      arrPagination: [],
      indexPage: 0,
    };
  }
  async componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { companyid } = this.state
    this.setState({ isLoading: true });

    const res = await API_CONNECT(
      `${ConstantApp.GET_LIST_HAIR}?company_id=${companyid}`, { }, "", "GET")

    var val = res.data

    this.pagination(val)

    if (this.state.colors.length == 0) {

      const color = await API_CONNECT(
        `${ConstantApp.GET_LIST_COLOR}?company_id=${companyid}`, { }, "", "GET")

      let c = []
      color.data.map(val => {
        c.push({
          value: val['_id'], label: val.hex, hex: val.hex
        })
      })

      this.setState({ colors: c });
    }


    if (this.state.brands.length == 0) {

      const brand = await API_CONNECT(
        `${ConstantApp.GET_LIST_BRAND}?company_id=${companyid}`, { }, "", "GET")

      this.setState({ brands: brand.data });
    }

    if (this.state.types.length == 0) {

      const type = await API_CONNECT(
        `${ConstantApp.GET_LIST_TYPE}?company_id=${companyid}`, { }, "", "GET")

      this.setState({ types: type.data });
    }

    this.setState({ isLoading: false });
  };

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

  select = (key, value) => {
    let t = null;

    this.state[`${key}s`].map((val) => {
      if (val["_id"] == value.target.value) {
        t = val;
      }
    });

    console.log(t);

    this.setState({ [key]: t });
  };

  createProduct = async () => {
    const { title, image, url, type, brand, color, companyid } = this.state;
    if (
      title == "" ||
      image == "" ||
      url == "" ||
      type == null ||
      brand == null,
      color == null
    ) {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return;
    }
    const body = {
      type_id: type["_id"],
      brand_id: brand["_id"],
      name: title,
      href: url,
      image: image,
      color_id: color.value,
      company_id: companyid
    };

    this.setState({ isLoading: true });
    const res = await API_CONNECT(
      ConstantApp.ADD_PRODUCT, body, "", "POST")

    if (res.status == 200) {
      this.getData();
    } else {
      alert(res.message);
      this.setState({ isLoading: false });
    }

    this.toggle("new");
  };

  onChange = (key, val) => {
    this.setState({ [key]: val });
  };

  changeColor = (val) => {
    console.log(val)
    this.setState({ color: val })
  }

  openUpdate = (item) => {
    let t = null;

    this.state.types.map((val) => {
      if (val["_id"] == item.type_id) {
        t = val;
      }
    });

    let b = null;

    this.state.brands.map((val) => {
      if (val["_id"] == item.brand_id) {
        b = val;
      }
    });

    this.setState({
      modal: !this.state.modal,
      action: "update",
      title: item.name,
      image: item.image,
      url: item.href,
      type: t,
      brand: b,
      productID: item["_id"],
      color: item.color ? { value: item.color['_id'], label: item.color.hex, hex: item.color.hex } : null
    });
  };

  updateProduct = async () => {
    const { title, image, url, type, brand, color } = this.state;
    if (
      title == "" ||
      image == "" ||
      url == "" ||
      type == null ||
      brand == null
    ) {
      alert("Vui lòng nhập đầy đủ trường dữ liệu !!!");
      return;
    }
    const body = {
      type_id: type["_id"],
      brand_id: brand["_id"],
      name: title,
      href: url,
      image: image,
      id: this.state.productID,
      color_id: color.value
    };

    this.setState({ isLoading: true });

    const res = await API_CONNECT(
      ConstantApp.UPDATE_PRODUCT, body, "", "POST")

    if (res.status == 200) {
      this.getData();
    } else {
      alert(res.message);
      this.setState({ isLoading: false });
    }

    this.toggle("new");
  };

  openDelete = (item) => {
    this.setState({
      modalDelete: !this.state.modalDelete,
      delete: item,
    });
  };

  delete = async () => {
    this.setState({ isLoading: true });

    const res = await API_CONNECT(
      ConstantApp.DELETE_PRODUCT, {
        id: this.state.delete["_id"],
      }, "", "POST")

    if (res.status == 200) {
      this.getData();
    } else {
      alert(
        res.message.replaceAll("{name}", `"${this.state.delete.name}"`)
      );
      this.setState({ isLoading: false });
    }

    this.setState({ modalDelete: !this.state.modalDelete, delete: null });
  };

  toggle(action) {
    this.setState({
      modal: !this.state.modal,
      action,
      isLoading: false,
      updateId: "",
      title: "",
      image: "",
      category: "",
      url: "",
      isHide: false,
      isActive100: false,
      errors: { },
      type: null,
      brand: null,
      productID: "",
      color: null
    });
  }
  execUpdate = (item) => {
    this.setState({
      action: "update",
      updateId: item._id,
      title: item.title ? JSON.stringify(item.title, null, "\t") : "",
      image: item.image,
      addresses: item.addresses ? item.addresses.join("\n") : "",
      description: item.description
        ? JSON.stringify(item.description, null, "\t")
        : "",
      isActive100: item.isActive100,
      category: item.category._id,
      url: item.url,
      modal: !this.state.modal,
    });
  };
  cancelCreate() {
    this.setState({
      modal: false,
    });
  }

  onChangeAct(e) {
    const checked = e.target.checked;
    this.setState({ [e.target.name]: checked });
  }
  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onChangeCat(e) {
    this.setState({ category: e.target.value });
  }
  deleteCard = (id) => {
    if (window.confirm("Are you sure to delete this item?")) {
      const fetchData = {
        method: "DELETE",
        headers: headers,
      };
      fetch(global.BASE_URL + "/browser-link/" + id, fetchData)
        .then(() => {
          this.setState({ deleted: "Item deleted", created: "" });
          // reload list
          this.componentDidMount();
          // const fetchData = {
          //   method: 'GET',
          //   headers: headers
          // };
          // const url = global.BASE_URL + '/admin/browser-links';
          // fetch(url, fetchData).then(async result => {
          //   const data = await result.json();
          //   this.state.data = data;
          //   this.setState(
          //     this.state
          //   );
          // }).catch(console.log);
        })
        .catch(console.log);
    }
  };
  render() {
    const {
      isActive100,
      errors,
      addresses,
      title,
      description,
      image,
      url,
      categories,
      category,
      data,
      arrPagination
    } = this.state;
    if (!this.state.isLoading) {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <p style={styles.success}>{this.state.created}</p>
              <p style={styles.danger}>{this.state.deleted}</p>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Chi tiết sản phẩm
                  {this.state.auth != 'update' && <Button
                    outline
                    color="primary"
                    style={styles.floatRight}
                    size="sm"
                    onClick={(e) => this.toggle("new")}
                  >
                    Thêm mới
                  </Button>}
                </CardHeader>
                <CardBody>
                  <table ble className="table table-hover table-outline mb-0 d-none d-sm-table">
                    <thead className="thead-light">
                      <tr>
                        <th className="text-center">STT.</th>
                        <th className="text-center">Loại</th>
                        <th className="text-center">Thương hiệu</th>
                        <th className="text-center">Tên</th>
                        <th className="text-center">Đường dẫn</th>
                        <th className="text-center">Màu</th>
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
                                <td className="text-center">{item.type}</td>
                                <td className="text-center">{item.brand}</td>
                                <td className="text-center">{item.name}</td>
                                <th className="text-center">
                                  <a
                                    href={item.href}
                                    target="_blank"
                                  >{`Open web`}</a>
                                </th>
                                <td className="text-center">
                                  {item.color.hex}
                                  <div style={{ backgroundColor: item.color.hex, width: '100%', height: '30px' }}> </div>
                                </td>
                                <th style={styles.w15}>
                                  <img src={item.image} style={styles.image} />
                                </th>

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
          <Modal
            isOpen={this.state.modal}
            toggle={(e) => this.cancelCreate()}
            className={this.props.className}
          >
            <ModalHeader toggle={() => this.toggle()}>
              {this.state.action === "update" ? "Edit" : "Create "}
            </ModalHeader>
            <ModalBody>
              <Form>
                <TextFieldGroup
                  field="name"
                  label="Name"
                  value={title}
                  error={errors.title}
                  onChange={(e) => this.onChange("title", e.target.value)}
                  rows="5"
                />
                <div>
                  <label htmlFor="tag">Type:  </label>
                  <select name="type" onChange={(e) => this.select("type", e)}>
                    <option
                      value={
                        this.state.action === "update"
                          ? `${this.state.type == null
                            ? null
                            : `${this.state.type["_id"]}`
                          }`
                          : null
                      }
                    >
                      {this.state.action === "update"
                        ? `${this.state.type == null
                          ? " - - - - - - - - - - "
                          : `${this.state.type.vi || this.state.type.name}`
                        }`
                        : " - - - - - - - - - - "}
                    </option>

                    {this.state.types.map((cat, i) => {
                      if (
                        this.state.action == "update" &&
                        cat["_id"] == this.state.type["_id"]
                      ) {
                        console.log("remove === ", cat);
                      } else {
                        return (
                          <option key={String(i)} value={cat["_id"]}>
                            {cat.vi || cat.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>
                <div>
                  <label htmlFor="tag">Brand:   </label>
                  <select
                    name="category"
                    onChange={(e) => this.select("brand", e)}
                  >
                    <option
                      value={
                        this.state.action === "update"
                          ? `${this.state.brand == null
                            ? null
                            : `${this.state.brand["_id"]}`
                          }`
                          : null
                      }
                    >
                      {this.state.action === "update"
                        ? `${this.state.brand == null
                          ? " - - - - - - - - - - "
                          : `${this.state.brand.name}`
                        }`
                        : " - - - - - - - - - - "}
                    </option>

                    {this.state.brands.map((cat, i) => {
                      if (
                        this.state.action == "update" &&
                        cat["_id"] == this.state.brand["_id"]
                      ) {
                        console.log("remove === ", cat);
                      } else {
                        return (
                          <option key={String(i)} value={cat["_id"]}>
                            {cat.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>
                <TextFieldGroup
                  field="image"
                  label="Image"
                  value={image}
                  error={errors.image}
                  onChange={(e) => this.onChange("image", e.target.value)}
                />
                <TextFieldGroup
                  field="href"
                  label="Href"
                  value={url}
                  error={errors.url}
                  onChange={(e) => this.onChange("url", e.target.value)}
                />
                <Select
                  defaultValue={this.state.color}
                  label="Single select"
                  options={this.state.colors}
                  styles={colourStyles}
                  isSearchable
                  onChange={this.changeColor}
                />
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={(e) => {
                  this.state.action === "update"
                    ? this.updateProduct()
                    : this.createProduct();
                }}
                disabled={this.state.isLoading}
              >
                Lưu
              </Button>{" "}
              <Button color="secondary" onClick={(e) => this.cancelCreate()}>
                Hủy
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.modalDelete}
            toggle={(e) =>
              this.setState({
                modalDelete: !this.state.modalDelete,
                delete: null,
              })
            }
            className={this.props.className}
          >
            <ModalHeader
              toggle={(e) =>
                this.setState({
                  modalDelete: !this.state.modalDelete,
                  delete: null,
                })
              }
            >{`Delete`}</ModalHeader>
            <ModalBody>
              <label htmlFor="tag">{`Do you want to delete product "${this.state.delete
                ? this.state.delete.vi || this.state.delete.name
                : ""
                }" ?`}</label>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={(e) => this.delete()}
                disabled={this.state.isLoading}
              >
                Xóa
              </Button>{" "}
              <Button
                color="secondary"
                onClick={(e) =>
                  this.setState({
                    modalDelete: !this.state.modalDelete,
                    delete: null,
                  })
                }
              >
                Hủy
              </Button>
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
  a: {
    textDecoration: "none",
  },
  floatRight: {
    float: "right",
  },
  spinner: {
    width: "30px",
  },
  center: {
    textAlign: "center",
  },
  tbody: {
    height: "380px",
    overflowY: "auto",
  },
  wh5: {
    width: "5%",
    float: "left",
    height: "100px",
  },
  wh10: {
    width: "9.8%",
    float: "left",
    height: "100px",
  },
  wh15: {
    width: "15%",
    float: "left",
    height: "100px",
  },
  wh20: {
    width: "20%",
    float: "left",
    height: "100px",
  },
  wh25: {
    width: "25%",
    float: "left",
    height: "100px",
  },
  wh30: {
    width: "30%",
    float: "left",
    height: "100px",
  },
  wh40: {
    width: "40%",
    float: "left",
    height: "100px",
  },
  wh5t: {
    width: "5%",
    float: "left",
    height: "70px",
  },
  wh10t: {
    width: "9.8%",
    float: "left",
    height: "70px",
  },
  wh15t: {
    width: "15%",
    float: "left",
    height: "70px",
  },
  wh20t: {
    width: "20%",
    float: "left",
    height: "70px",
  },
  wh25t: {
    width: "25%",
    float: "left",
    height: "70px",
  },
  wh30t: {
    width: "30%",
    float: "left",
    height: "70px",
  },
  wh40t: {
    width: "40%",
    float: "left",
    height: "70px",
  },
  w5: {
    width: "5%",
    float: "left",
  },
  w10: {
    width: "10%",
    float: "left",
  },
  w15: {
    width: "15%",
    float: "left",
  },
  w20: {
    width: "20%",
    float: "left",
  },
  w25: {
    width: "25%",
    float: "left",
  },
  w30: {
    width: "30%",
    float: "left",
  },
  w40: {
    width: "40%",
    float: "left",
  },
  row: {
    float: "left",
    width: "100%",
  },
  success: {
    color: "green",
  },
  danger: {
    color: "red",
  },
  mgl5: {
    margin: "5px",
  },
  mgb5: {
    marginBottom: "5px",
  },
  image: {
    width: "50px",
    height: "50px",
    borderRadius: "9999999px",
  },
};

export default ProductHair;

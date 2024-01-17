import React, { Component } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,

  FormGroup,
  Input,
} from "reactstrap";
import "moment-timezone";

import Form from 'react-bootstrap/Form';

import {
  CRow,
  CCol,
  CLabel,
} from '@coreui/react'
import CreatableSelect from 'react-select/creatable';
import TextArea from "../../../../Common/TextArea";
import validateInput from "./../../../../../helpers/news";
import TextFieldGroup from "../../../../Common/TextFieldGroup";
import Constants from "./../../../../../contants/contants";
import Pagination from "react-js-pagination";
import ConstantApp from "../../../../../contants/contants";
import Select from 'react-select';
import API_CONNECT from "../../../../../../src/helpers/callAPI";
const degree = [
  { value: '1', label: 'Mức độ nhẹ' },
  { value: '2', label: 'Mức độ TB' },
  { value: '3', label: 'Mức độ nặng' }
]

const options = [
  { value: '1', label: 'Mức độ nhẹ', color: '#00B8D9' },
  { value: '2', label: 'Mức độ TB', color: '#0052CC' },
  { value: '3', label: 'Mức độ nặng', color: '#5243AA' },
 
];
let headers = new Headers();
headers.append("Content-Type", "application/json");
let BASE_URL = ConstantApp.BASE_URL

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      title_en: "",
      title_jp: "",
      image: "",
      video: "",
      description_en: "",
      description_jp: "",
      deleted: false,
      isLoading: false,
      errors: {},
      action: "",
      created: "",
      activePage: 1,
      numPage: 1,
      itemsCount: 0,
      itemPerPage: 20,
      openDate: new Date(),
      // new data
      name: "",
      image: "",
      key: "",
      title: "",
      description: "",
      linkdetail: "",
      level: window.location.hash.split('/')[window.location.hash.split('/').length - 1],
      sdktype: "1",
      sdkItem: [],
      currentSdkSelect: "",
      currentItemSelect: null,
      idSDK: window.location.hash.split('/')[window.location.hash.split('/').length - 1],
      hidden: false,
      role: localStorage.getItem('role'),
      companyid: localStorage.getItem('company_id'),
    };
  }

  
  async componentDidMount() {
    this.loadData();
  }
  loadData = () => {
  

    const { activePage = 1, itemPerPage = 200, key = "", idSDK, companyid } = this.state;

    const fetchData = {
      method: "GET",
    };

    fetch(
      BASE_URL +
      `/productSuggest/getAll?limit=${itemPerPage}&page=${activePage}&key=${key}&level=${idSDK}&company_id=${companyid}`,
      fetchData
    )
      .then((cards) => {
        cards.json().then((result) => {
         
          if (result.data.length == 0) {
            this.setState({ hidden: false })
          } else {
            this.setState({ hidden: true })
          }
          this.setState({
            data: result.data,
            itemsCount: 100,
            // isLoading: false,
          });
        });
      })
      .catch(console.log);
    fetch(BASE_URL + "/sdk", fetchData)
      .then((cards) => {
        
        cards.json().then((result) => {
          if(result.length <1)
          {
            return;
          }
          this.setState({
            sdkItem: result ? result : [],
            currentSdkSelect: result[0],
            isLoading: false,
            currentItemSelect: null,
          });
        });
      })
      .catch(console.log);
  };
  toggle(action) {
    this.setState({
      modal: !this.state.modal,
      action,
      isLoading: false,
      updateId: "",
      title_en: "",
      title_jp: "",
      video: "",
      description_en: "",
      description_jp: "",
      deleted: false,
      errors: {},
      openDate: new Date(),
      name: "",
      image: "",
      title: "",
      description: "",
      linkdetail: "",
    
      sdktype: "1",
    });
  }
  execUpdate = (item) => {
    const { sdkItem } = this.state;
    const currentSelected = sdkItem.find((i) => i.name === item.level);
    this.setState({
      action: "update",
      updateId: item._id,
      title_en: item.title_en || "",
      title_jp: item.title_jp || "",
      description_en: item.description_en || "",
      description_jp: item.description_jp || "",
      image: item.image,
      video: item.video,
      openDate: new Date(),
      modal: !this.state.modal,
      name: item.name || "",
      image: item.image || "",
      title: item.title || "",
      description: item.description || "",
      linkdetail: item.linkdetail || "",
      level: item.level || "",
      sdktype: item.sdktype || "",
      companyid: item.companyid || "",
      currentSdkSelect: currentSelected,
    });
  };
  cancelCreate() {
    this.setState({
      modal: false,
      updateId: "",
      title_en: "",
      title_jp: "",
      description_en: "",
      description_jp: "",
      image: "",
      video: "",
      openDate: new Date(),
      name: "",
      image: "",
      title: "",
      description: "",
      linkdetail: "",
      level: "K5",
      sdktype: "1",
      currentSdkSelect: this.state.sdkItem[0],
    });
  }

  handleChange = (newValue, actionMeta) => {

    this.setState({ sdktype: newValue.value })

  };
  onChangeImage(e) {
    let files = e.target.files;
    let reader = new FileReader();
    this.setState({ image: files[0], image_update: files[0] })
    reader.readAsDataURL(files[0])
    reader.onload = (e) => {
      this.setState({ image_show: e.target.result })
    }
  }
  inputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  deleteCard = (id) => {
    if (window.confirm("Are you sure to delete this item?")) {
      const fetchData = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ id: id }),
      };
      fetch(BASE_URL + "/productSuggest/delete", fetchData)
      .then(() => {
        this.setState({ deleted: "Sản phẩm đã xoá", created: "" });
      
        this.loadData();
      })
      .catch((e) => {
        console.log("e", e);
      });
    }
  };
  handlePageChange = async (pageNumber) => {
    this.setState({ activePage: pageNumber, isLoading: true }, () => {
      this.loadData();
    });
  };
  onDateChange = (date) => {
    if (date) {
      this.setState({ openDate: date });
    }
  };

  changeSdkType = (e) => {
    e.preventDefault();
    const { sdkItem } = this.state;
    let data = sdkItem.find((item) => item.name === e.target.value);
    if (data) {
      this.setState({
        currentSdkSelect: data,
        level: data.name,
        sdktype: "1",
      });
    }
  };
  changeLevel = (e) => {
    e.preventDefault();
    this.setState({
      sdktype: e.target.value,
    });
  };

  goSearch() {
    this.loadData();
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }

  async updateApp ()  {

    const { name, image, title, description, 
      linkdetail, level,idSDK, sdktype, action, 
      
      updateId, companyid } = this.state;
      const form = new FormData();
      form.append("image", image);
       await API_CONNECT(Constants.UPLOAD_PRODUCT, form, "", "POST")
  //  this.setState({ errors: {}, isLoading: true });

       const body = {
         name: name || "",
         image: image.name,
         title: title || "",
         description: description || "",
         linkdetail: linkdetail || "",
         level: idSDK || "",
         sdktype: sdktype || "",
         companyid: companyid,
       };
   

       const fetchData = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      };
     

      fetch(BASE_URL + "/productSuggest/add", fetchData)
        .then(async () => {
     
          this.cancelCreate();
          // this.loadData();
          this.setState({
            created: "Thêm sản phẩm thành công",
            isLoading: false,
            deleted: false,
          });
        })
    
    };

  getBadgeSDK(type, i) {
    const { sdkItem } = this.state;
    if(type == "K1" || type == "K2" || type == "K3" || type == "K4")
    {
      sdkItem.splice(i, 1)
      this.setState({ sdkItem: sdkItem })
    }
    switch (type) {
      case 'K5': return 'Hỗ trợ giảm lão hoá da'
      case 'K6': return 'Hỗ trợ điều trị mụn'
      case 'K7': return 'Hỗ trợ giảm quầng thâm mắt'
      case 'K8': return 'Hỗ trợ giảm lỗ chân lông'
      case 'K9': return 'Hỗ trợ giảm thâm nám da'
    }
  }

  render() {
    const {
      data,
      errors,
      name,
      image,
      title,
      brand,
      description,
      linkdetail,
      sdktype,
      sdkItem,
      key,
      idSDK,
      currentSdkSelect,
    } = this.state;
    const page = this.state.activePage;
    const limit = this.state.itemPerPage;
    let defaultValue =  { value: '1', label: 'Mức độ nhẹ' };
    let valueObject =  { value: '2', label: 'Mức độ TB' };

    for (let i = 0; i < options.length; i++) {
      if(sdktype == options[i].value)
      {
        valueObject = options[i];
      }
    }

    let capdoText = "Mức độ nhẹ";
    if(sdktype == "2")
    {
      capdoText = "Mức độ trung bình";
    }
    if(sdktype == "3")
    {
      capdoText = "Mức độ nặng";
    }
    let productText = "Hỗ trợ lão hoá da";

    if(idSDK =="K6")
    {
      productText ="Hỗ trợ điều trị mụn";
    }
    if(idSDK =="K7")
    {
      productText ="Hỗ trợ giảm quầng thâm mắt";
    }
    if(idSDK =="K8")
    {
      productText ="Hỗ trợ giảm lỗ chân lông";
    }
    if(idSDK =="K9")
    {
      productText ="Hỗ trợ giảm thâm nám da";
    }

    if (!this.state.isLoading) {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <p style={styles.success}>{this.state.created}</p>
              <p style={styles.danger}>{this.state.deleted}</p>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i>{productText}
                  <div style={styles.tags}>
                  
                    <Button
                      outline
                      color="primary"
                      style={styles.marginCenter}
                      size="sm"
                      onClick={(e) => this.toggle("new")}
                    >
                      Thêm
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>

                  <table ble className="table table-hover table-outline mb-0 d-none d-sm-table">
                    <thead className="thead-light">
                      <tr>
                        <th className="text-center">STT.</th>
                        <th className="text-center">Tên</th>
                        <th className="text-center">Hình ảnh</th>
                   
                        <th className="text-center">Mô tả</th>
                        <th className="text-center">Đường dẫn chi tiết</th>
                    
                        <th className="text-center">Cấp độ</th>
                        <th className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <td colSpan="10" hidden={this.state.hidden} className="text-center">Không tìm thấy dữ liệu</td>
                      {
                      
                      data.map((item, i) => {
                      let imageShow ='http://207.148.71.172:3006/image_product/' + item.image;
                      
                        item.description = item.description || "";
                        return (
                          <tr key={i}>
                            <td className="text-center">
                              {(page - 1) * limit + i + 1}
                            </td>
                            <td className="text-center">{item.name}</td>
                            <td className="text-center">
                             <img className ="imageShow"  src ={imageShow}/> 
                            </td>

                            <td className="text-center">{item.description}</td>
                            <td className="text-center">
                              <a target="_blank" href={item.linkdetail}>Chi tiết sản phẩm</a>
                            </td>
                        
                            <td className="text-center">{capdoText}</td>
                            <td className="text-center">
                              {/* <Button
                                outline
                                color="primary"
                                size="sm"
                                onClick={(e) => this.execUpdate(item)}
                              >
                                Cập nhật
                              </Button> */}
                              &nbsp;
                              <Button
                                outline
                                color="danger"
                                size="sm"
                                onClick={(e) => this.deleteCard(item._id)}
                              >
                                Xóa
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            
            </Col>
          </Row>
          <Modal
            isOpen={this.state.modal}
            toggle={(e) => this.cancelCreate()}
            className={this.props.className }
          >
            <ModalHeader toggle={() => this.toggle()}>
              {this.state.action === "update" ? "Cập nhật" : "Tạo mới "}
            </ModalHeader>
            <ModalBody>
              <Form>
                {/*<FormGroup>*/}
                <TextFieldGroup
                  field="name"
                  label="Tên sản phẩm"
                  value={name}
                  error={errors.name}
                  onChange={(e) => this.inputChange(e)}
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
                  <TextArea
                  field="description"
                  label="Mô tả"
                  value={description}
                  error={errors.description}
                  onChange={(e) => this.inputChange(e)}
                  rows="7"
                />
               
             
                <TextFieldGroup
                  field="linkdetail"
                  label="Đường dẫn chi tiết sản phẩm"
                  value={linkdetail}
                  error={errors.linkdetail || ""}
                  onChange={(e) => this.inputChange(e)}
                />
                <FormGroup>
               
                <CLabel>Mức độ:</CLabel>

              
                  <CreatableSelect
                    isClearable
                    options={options}
                    
                    value={valueObject}
                    defaultValue = {defaultValue}
                    onChange={this.handleChange}
                    
                  />
                </FormGroup>

                <TextFieldGroup
                  field="brand"
                  label="Thương hiệu"
                  value={brand}
               
                  onChange={(e) => this.inputChange(e)}
                />
                
              
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={(e) => { this.updateApp() }}
                disabled={this.state.isLoading}
              >
                Lưu
              </Button>
              &nbsp;&nbsp;
              <Button color="secondary" onClick={(e) => this.cancelCreate()}>
                Hủy
              </Button>
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
  a: {
    textDecoration: "none",
  },
  floatRight: {
    float: "right",
  },
  floatCenter: {
    float: "center",
  },
  marginCenter: {
    marginLeft: "5px",
    marginRight: "5px",
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
    height: "70px",
  },
  wh10: {
    width: "9.8%",
    float: "left",
    height: "70px",
  },
  wh15: {
    width: "15%",
    float: "left",
    height: "70px",
  },
  wh20: {
    width: "20%",
    float: "left",
    height: "70px",
  },
  wh25: {
    width: "25%",
    float: "left",
    height: "70px",
  },
  wh30: {
    width: "30%",
    float: "left",
    height: "70px",
  },
  wh40: {
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
    marginLeft: "5px",
  },
  tags: {
    float: "right",
    marginRight: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // width: "450px",
  },
  searchInput: {
    width: "190px",
    display: "inline-block",
  },
};

export default News;

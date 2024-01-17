import React, { lazy, Component } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormGroup,
  CLabel,
  CSelect, CCardGroup
} from '@coreui/react'

import {
  CChartBar,
} from '@coreui/react-chartjs'

import {
  Button
} from 'reactstrap';
import axios from 'axios'
import Constants from "./../../contants/contants";

import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";
import Pagination from '@material-ui/lab/Pagination';
import API_CONNECT from "../../../src/helpers/callAPI";

class ShopManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: 0,
      dataUserSale: [],
      dataStatistical: [],
      arrPaginationStatistical: [],
      indexPageStatistical: 0,
      company_id: localStorage.getItem('user'),
      dataApi: [],
      arrTemp: [],
      hidden: true,
      hidden_all: true,
      arrAllUser: [],
      token: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      isLoading: false,
      isLoadingCustomer: false,
      lengthData: []
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    await this.getCustomerByMonth("01");
    await this.getDataForCharts();
    await this.getCustomer(0);
  }

  countType(arr, phone) {
    const count = arr.filter(data => data.Phone == phone);
    return count.length;
  }

  pagination_statistical(dataApi) {
    var i, j, temparray, chunk = 5;
    var arrTotal_Statistical = [];
    for (i = 0, j = dataApi.length; i < j; i += chunk) {
      temparray = dataApi.slice(i, i + chunk);
      arrTotal_Statistical.push(temparray);
    }
    this.setState({ arrPaginationStatistical: arrTotal_Statistical, dataStatistical: arrTotal_Statistical[this.state.indexPageStatistical] });
  }

  async getCustomer(index) {

    const { company_id } = this.state;
    var id = JSON.parse(company_id);
    this.setState({ isLoadingCustomer: true })

    const res = await API_CONNECT(Constants.LIST_CUSTOMER_V2, {
      "condition": {
        "Company_Id": id.company_id
      },
      "index": index
    }, this.state.token, "POST")


    if (res.is_success == true) {
      let data = res.data.data

      this.setState({ dataApi: data, isLoadingCustomer: false, dataUserSale: data, lengthData: res.data.count });
    }

  }

  async getDataForCharts() {
    const { company_id } = this.state;
    var id = JSON.parse(company_id);

    const res = await axios({
      baseURL: Constants.BASE_URL,
      url: Constants.COMPANY_CHART,
      method: 'POST',
      data: {
        company_id: id.company_id
      }
    });

    this.setState({ arrAllUser: res.data.data, isLoading: false })
  }

  async getCustomerByMonth(month) {
    const { company_id } = this.state;
    var id = JSON.parse(company_id);
    var bodyUser = {
      company_id: id.company_id,
      month: month
    }

    if (month == 0) {
      await this.getCustomer(0);
    } else {
      const res = await axios({
        baseURL: Constants.BASE_URL,
        url: Constants.LIST_CUSTOMER_BY_MONTH,
        method: 'POST',
        data: bodyUser
      });

      let data = res.data.data
      if (data.length == 0) {
        this.setState({ hidden: false })
      } else {
        this.setState({ hidden: true })
      }
      this.setState({ dataApi: data, arrTemp: data, isLoading: false });

      this.pagination_statistical(data);
    }
  }

  render() {
    const { dataUserSale, hidden, isLoading, hidden_all, lengthData,
      dataStatistical, arrPaginationStatistical, isLoadingCustomer } = this.state;
    if (!isLoading) {
      return (
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <CFormGroup row>
                  <CCol xs="12" sm="12" md="3" lg="3">
                    <CLabel htmlFor="selectSm">Thống kê tổng số lượt user</CLabel>
                  </CCol>
                  <CCol xs="12" sm="12" md="9" lg="9">

                  </CCol>
                </CFormGroup>
              </CCardHeader>
              <CCardBody>
                {
                  isLoadingCustomer ?
                    <div className="sweet-loading" style={{ height: 276 }}>
                      <DotLoader css={override} size={50} color={"#123abc"} loading={isLoadingCustomer} speedMultiplier={1.5} />
                    </div> :
                    <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                      <thead className="thead-light">
                        <tr>
                          <th className="text-center">STT.</th>
                          <th className="text-center">Tên</th>
                          <th className="text-center">Email</th>
                          <th className="text-center">Số điện thoại</th>
                          <th className="text-center">Giới tính</th>
                          <th className="text-center">Số lần đến</th>
                          <th className="text-center">Hệ số</th>
                          <th className="text-center">Lần cuối đến</th>
                        </tr>
                      </thead>
                      <tbody>
                        <td colSpan="9" hidden={hidden_all} className="text-center">Không có dữ liệu</td>
                        {
                          dataUserSale != undefined ?
                            dataUserSale.map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td className="text-center">{i + 1}</td>
                                  <td className="text-center">{item.Name}</td>
                                  <td className="text-center">{item.Email}</td>
                                  <td className="text-center">{item.Phone}</td>
                                  <td className="text-center">{item.Gender}</td>
                                  <td className="text-center">{item.count}</td>
                                  <td className="text-center">{Number(item.coefficient).toFixed(2)}</td>
                                  <td className="text-center">
                                    {(new Date(item.Create_Date)).toLocaleDateString() + ' ' + (new Date(item.Create_Date)).toLocaleTimeString()}
                                  </td>
                                </tr>
                              );
                            }) : ""
                        }
                      </tbody>
                      <tfoot>

                      </tfoot>
                    </table>
                }
                <div style={{ width: '100%', margin: 10 }}>
                  <Pagination count={lengthData} color="primary" onChange={(e, v) => {
                    this.getCustomer(v - 1)
                  }} />
                </div>
                <br />

                <CRow>
                  <CCol xs="12" sm="5">
                    <CCard backgroundColor="red">
                      <CCardHeader>
                        Biểu đồ thể hiện lượt người dùng qua từng tháng
                      </CCardHeader>
                      <CCardBody>
                        <CChartBar
                          datasets={[
                            {
                              label: 'Tổng người lượt người dùng của tháng ',
                              backgroundColor: '#0008ff',
                              data: this.state.arrAllUser
                            }
                          ]}
                          labels="months"
                          options={{
                            tooltips: {
                              enabled: true
                            }
                          }}
                        />
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol xs="12" sm="7">
                    <CCard>
                      <CCardHeader>
                        <CFormGroup row>
                          <CCol xs="12" md="8">
                            <CLabel htmlFor="selectSm">Người dùng theo tháng</CLabel>
                          </CCol>
                          <CCol xs="12" md="4">
                            <div style={{ float: "right", width: "250px" }}>
                              <CSelect onChange={async e => { await this.getCustomerByMonth(e.target.value) }} custom size="sm" name="selectSm" id="SelectLm">
                                <option value="01">01</option>
                                <option value="02">02</option>
                                <option value="03">03</option>
                                <option value="04">04</option>
                                <option value="05">05</option>
                                <option value="06">06</option>
                                <option value="07">07</option>
                                <option value="08">08</option>
                                <option value="09">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                              </CSelect>
                            </div>
                          </CCol>
                        </CFormGroup>
                      </CCardHeader>
                      <CCardBody>
                        <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                          <thead className="thead-light">
                            <tr>
                              <th className="text-center">Tên</th>
                              <th className="text-center">Số điện thoại</th>
                              <th className="text-center">Giới tính</th>
                              <th className="text-center">Số lần đến</th>
                              <th className="text-center">Hệ số</th>
                            </tr>
                          </thead>
                          <tbody>
                            <td colSpan="7" hidden={hidden} className="text-center">Không có user trong tháng này</td>
                            {
                              dataStatistical != undefined ?
                                dataStatistical.map((item, i) => {
                                  return (
                                    <tr key={i}>
                                      <td className="text-center">{item.Name}</td>
                                      <td className="text-center">{item.Phone}</td>
                                      <td className="text-center">{item.Gender}</td>
                                      <td className="text-center">{item.count}</td>
                                      <td className="text-center">{Number(item.coefficient).toFixed(2)}</td>
                                    </tr>
                                  );
                                }) : ""
                            }
                          </tbody>
                        </table>

                        <div style={{ float: 'right' }}>
                          <Pagination count={arrPaginationStatistical.length} color="primary" onChange={(e, v) => {
                            this.setState({
                              dataStatistical: arrPaginationStatistical[v - 1], indexPageStatistical: v - 1
                            })
                          }} />
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>



              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

      )
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

export default ShopManager

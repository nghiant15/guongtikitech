import React, { lazy, Component } from 'react'

import ShopManager from './ShopManager'
import SaleManager from './SaleManager'
import AdminManager from './AdminManager'


let headers = new Headers();
const auth = localStorage.getItem('auth');
headers.append('Authorization', 'Bearer ' + auth);
headers.append('Content-Type', 'application/json');
class Dashboard extends Component {

  render() {
    return (
      <div>
        {
          localStorage.getItem('role') == 'SALES' ? <SaleManager /> :
            localStorage.getItem('role') == 'COMPANY' ? <ShopManager /> :
              localStorage.getItem('role') == 'ADMIN' ? <AdminManager /> : <AdminManager />
        }
      </div>
    )
  }
}

export default Dashboard

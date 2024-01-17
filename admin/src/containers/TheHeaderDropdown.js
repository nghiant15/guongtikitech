import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
  CLabel
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Nav, NavItem, NavLink } from 'reactstrap';

const TheHeaderDropdown = () => {
  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-5"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar" style={{ width: '100%' }}>

          <div className="mr-2" style={{ fontSize: 20, color: 'orange', fontFamily: 'Myriad Pro Regular' }}>
            <strong>
              {JSON.parse(localStorage.getItem('user')) == null || JSON.parse(localStorage.getItem('user')) == undefined ? "" : JSON.parse(localStorage.getItem('user')).username}
            </strong>
          </div>
          {/* <CImg
            src={'avatars/6.jpg'}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          /> */}
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          <NavLink onClick={() => { window.location.href = '#/login' }}>Logout</NavLink>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown

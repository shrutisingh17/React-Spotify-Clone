import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdHomeFilled } from 'react-icons/md';
import { BiSearch, BiLibrary } from 'react-icons/bi';

const NavItem = ({ data_tip, data_for, data_event, exact, to, style, name, label }) => {
  return (
    <li className='NavItem' data-tip={data_tip} data-for={data_for} data-event={data_event}>
      {exact ? (
        <NavLink exact to={to} className='nav-link' activeClassName='activeMainNav' style={style}>
          <div className='nav-icon'>
            {name === 'Home' ? <MdHomeFilled style={{ width: '24px', height: '24px' }} /> : <BiSearch style={{ width: '24px', height: '24px' }} />}
          </div>
          <span>{label}</span>
        </NavLink>
      ) : (
        <NavLink to={to} className='nav-link' activeClassName='activeMainNav' style={style}>
          <div className='nav-icon'>
            <BiLibrary style={{ width: '24px', height: '24px' }} />
          </div>
          <span>{label}</span>
        </NavLink>
      )}
    </li>
  );
};

export default NavItem;

import React from 'react';
import {GrInstallOption} from 'react-icons/gr';
import Icon from '../icons';

const InstallCTA = () => {
  return (
    <div className='cta-wrapper'>
      <a href="https://spotify.com/download" className='nav-link'>
        <div className="nav-icon install-icon">
          <Icon name='Install' viewBox='0 0 20 20' width='20px' height='20px' />
        </div>
        <span style={{fontSize:"12px"}}>Install App</span>
      </a>
    </div>
  );
}
{/* <GrInstallOption style={{width:'20px', height:'20px'}} /> */}
export default InstallCTA;

import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { navigationItems } from '../config';

const Sidebar=() =>{
	return <div className='sidebar'>
        <div className="sidebar__items">
            <Link to ="/dashboard">Dashboard/Home</Link>
            <Link to ="/about">About</Link>
            <Link to ="/login">Login</Link>
            <Link to ="/register">Register</Link>
            <Link to ="/settings">Settings</Link>
            <button>Log Out</button>
        </div>
    </div>
}

export default Sidebar;

import { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

export function FootySidebar() {
    const [collapsed, setCollapsed] = useState(false);
  
    const handleToggleSidebar = () => {
      setCollapsed(!collapsed);
    };
  
    return (
      <div className='sidebar'>
        <Sidebar collapsed={collapsed}>
            <button onClick={handleToggleSidebar}>Toggle Sidebar</button>
            <Menu>
            <MenuItem component={<Link to="/" />}>Home</MenuItem>
            <MenuItem component={<Link to="/transferxi" />}>Transfer XI</MenuItem>
            </Menu>
        </Sidebar>
      </div>
    );
  }
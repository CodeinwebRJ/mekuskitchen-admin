import { Sidebar } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ChildItem } from '../Sidebaritems';

interface NavItemsProps {
  item: ChildItem;
}

const NavItems: React.FC<NavItemsProps> = ({ item }) => {
  const renderIcon = (icon?: string, size: number = 20) =>
    icon ? <Icon icon={icon} width={size} className="mr-3" /> : null;

  if (item.children && item.children.length > 0) {
    return (
      <Sidebar.Collapse label={item.name} icon={() => renderIcon(item.icon)}>
        {item.children.map((child ,index) => (
          <Sidebar.Item key={index} as={Link} to={child.url} className="pl-8 flex items-center">
            <div className="flex items-center">
              {renderIcon(child.icon, 16)}
              <span>{child.name}</span>
            </div>
          </Sidebar.Item>
        ))}
      </Sidebar.Collapse>
    );
  }

  return (
    <Sidebar.Item as={Link} to={item.url} key={item.id} className="flex items-center">
      <div className="flex items-center">
        {renderIcon(item.icon)}
        <span>{item.name}</span>
      </div>
    </Sidebar.Item>
  );
};

export default NavItems;

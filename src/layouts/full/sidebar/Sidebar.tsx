import { Sidebar } from 'flowbite-react';
import SimpleBar from 'simplebar-react';
import { Link } from 'react-router-dom'; 
import NavItems from './NavItems';
import SidebarContent from './Sidebaritems';

const SidebarLayout = () => {
  return (
    <div className="xl:block hidden">
      <Sidebar
        className="fixed menu-sidebar bg-white dark:bg-darkgray rtl:pe-4 rtl:ps-0"
        aria-label="Sidebar with multi-level dropdown example"
      >
        <div className="px-4 py-5 flex items-center justify-center sidebarlogo">
          <Link to="/">
            <span className="cursor-pointer font-bold text-2xl text-black dark:text-white">
              Mekus Kitchen
            </span>
          </Link>
        </div>
        <SimpleBar className="h-[calc(100vh-80px)] py-5">
          <Sidebar.Items>
            <Sidebar.ItemGroup className="sidebar-nav">
              {SidebarContent.map((section, index) => (
                <div className="caption" key={index}>
                  {section.children && section.children.length > 0 ? (
                    section.children.map((child, childIndex) => (
                      <NavItems key={childIndex} item={child} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No items</p>
                  )}
                </div>
              ))}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </SimpleBar>
      </Sidebar>
    </div>
  );
};

export default SidebarLayout;

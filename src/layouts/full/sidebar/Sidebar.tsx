import { Sidebar } from 'flowbite-react';
import SimpleBar from 'simplebar-react';
import FullLogo from '../shared/logo/FullLogo';
import NavItems from './NavItems';
import SidebarContent from './Sidebaritems';

const SidebarLayout = () => {
  return (
    <div className="xl:block hidden">
      <Sidebar
        className="fixed menu-sidebar bg-white dark:bg-darkgray rtl:pe-4 rtl:ps-0"
        aria-label="Sidebar with multi-level dropdown example"
      >
        <div className="px-12 py-6 flex items-center justify-center sidebarlogo">
          <FullLogo />
        </div>
        <SimpleBar className="h-[calc(100vh_-_230px)]">
          <Sidebar.Items className="px-5">
            <Sidebar.ItemGroup className="sidebar-nav">
              {SidebarContent.map((item) => (
                <div className="caption" key={item.heading}>
                  <h5 className="text-link dark:text-white/70 caption font-semibold leading-6 tracking-widest text-xs pb-2 uppercase">
                    {item.heading}
                  </h5>
                  {item.children?.map((child) => (
                    <NavItems key={child.id} item={child} />
                  ))}
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

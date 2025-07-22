import { Dropdown } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import Logo from '../../../../public/logo.png';
import { logout } from 'src/Store/Slices/AdminUser';

const Profile = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigation('/auth/login');
  };

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="rounded-sm w-44"
        dismissOnClick={false}
        renderTrigger={() => (
          <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full border flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <img src={Logo} alt="logo" height="35" width="35" className="rounded-full " />
          </span>
        )}
      >
        <Dropdown.Item
          as={Link}
          to="/profile"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:user-circle-outline" height={20} />
          My Profile
        </Dropdown.Item>
        {/* <Dropdown.Item
          as={Link}
          to="#"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:letter-linear" height={20} />
          My Account
        </Dropdown.Item> */}
        {/* <Dropdown.Item
          as={Link}
          to="#"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:checklist-linear" height={20} />
          My Task
        </Dropdown.Item> */}
        <Dropdown.Item
          onClick={handleLogout}
          className="flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:logout-outline" height={20} />
          Logout
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

export default Profile;

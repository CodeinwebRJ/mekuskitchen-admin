import Logo from '../../../../../public/logo.png';
import { Link } from 'react-router';

const FullLogo = () => {
  return (
    <Link to="/" className="block">
      <div className="flex justify-center items-center">
        <img
          src={Logo}
          alt="logo"
          className="w-full max-w-[230px] h-auto max-h-24 object-cover rounded-sm border p-3"
        />
      </div>
    </Link>
  );
};

export default FullLogo;

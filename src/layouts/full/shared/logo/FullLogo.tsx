import Logo from "../../../../../public/logo.png";
import { Link } from "react-router";
const FullLogo = () => {
  return (
    <Link to={"/"}>
      <img src={Logo} alt="logo" className="block bg-blue-700 px-2 py-2 rounded-sm" />
    </Link>
  );
};

export default FullLogo;

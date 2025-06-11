import { useEffect, useState } from 'react';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { Login } from 'src/AxiosConfig/AxiosConfig';
import { login } from 'src/Store/Slices/AdminUser';
import { useDispatch } from 'react-redux';

const AuthLogin = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedId = localStorage.getItem('remembered_uniqueId');
    const storedPwd = localStorage.getItem('remembered_password');

    if (storedId && storedPwd) {
      setUniqueId(storedId);
      setPassword(storedPwd);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg('');

    try {
      const response = await Login({ uniqueId, password });
      const { token, admin } = response.data.data;
      dispatch(login(response.data.data));
      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(admin));
      }
      navigate('/');
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Login failed';
      setErrorMsg(message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="mb-2 block">
          <Label value="Unique Id" />
        </div>
        <TextInput
          id="uniqueId"
          type="text"
          sizing="md"
          required
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <div className="mb-2 block">
          <Label value="Password" />
        </div>
        <TextInput
          id="userpwd"
          type="password"
          sizing="md"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-between my-5">
        <div className="flex items-center gap-2">
          <Checkbox
            id="accept"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="checkbox"
          />
          <Label htmlFor="accept" className="opacity-90 font-normal cursor-pointer">
            Remember Me
          </Label>
        </div>
        <Link to="/forgot-password" className="text-primary text-sm font-medium">
          Forgot Password?
        </Link>
      </div>
      {errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>}
      <Button type="submit" className="w-full bg-primary text-white rounded-xl">
        Sign in
      </Button>
    </form>
  );
};

export default AuthLogin;

import { useState } from 'react';
import { Button, Label, TextInput, Alert } from 'flowbite-react';
import FullLogo from 'src/layouts/full/shared/logo/FullLogo';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom'; // ✅ FIXED: useNavigate from react-router-dom
import { IoIosArrowRoundBack } from 'react-icons/io';
import { SendOtp, ResetPassword } from 'src/AxiosConfig/AxiosConfig';

const gradientStyle = {
  background:
    'linear-gradient(45deg, rgba(238, 119, 82, 0.2), rgba(231, 60, 126, 0.2), rgba(35, 166, 213, 0.2), rgba(35, 213, 171, 0.5))',
  backgroundSize: '400% 400%',
  animation: 'gradient 15s ease infinite',
  height: '100vh',
};

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    otp?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    setErrorMsg('');
    const errors: { email?: string } = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(email)) errors.email = 'Invalid email format';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    try {
      const res = await SendOtp(email);
      sessionStorage.setItem('otp', res.data.data);
      setStep(2);
    } catch (error) {
      setErrorMsg('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    setErrorMsg('');
    const errors: { otp?: string } = {};
    if (!otp.trim()) errors.otp = 'OTP is required';
    else if (otp.length < 4) errors.otp = 'OTP must be at least 4 characters';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    const originalOtp = sessionStorage.getItem('otp');
    if (otp === originalOtp) {
      setStep(3);
    } else {
      setErrorMsg('Invalid OTP');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    setErrorMsg('');
    const errors: {
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!newPassword.trim()) errors.newPassword = 'New password is required';
    else if (newPassword.length < 8) errors.newPassword = 'Must be at least 8 characters';

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    try {
      await ResetPassword({ email, newPassword });
      setSuccessMsg('Password updated successfully');
      navigate('/auth/login');
    } catch (error) {
      setErrorMsg('Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={gradientStyle} className="relative overflow-hidden h-screen">
      <div className="flex h-full justify-center items-center px-4">
        <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 w-full max-w-md border-none">
          <div className="flex flex-col gap-8 w-full">
            <div className="mx-auto">
              <FullLogo />
            </div>
            <div className="flex flex-col gap-2">
              {successMsg && (
                <Alert color="success" id="success-message">
                  {successMsg}
                </Alert>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="email" className="mb-2 block">
                      Email
                    </Label>
                    <TextInput
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormErrors((prev) => ({ ...prev, email: '' }));
                      }}
                    />
                    {formErrors.email && <p className="text-red-600">{formErrors.email}</p>}
                  </div>
                  <Button
                    className="mt-4 w-full bg-primary"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    isProcessing={isLoading}
                  >
                    Send OTP
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="otp" className="mb-2 block">
                      Enter OTP
                    </Label>
                    <TextInput
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setFormErrors((prev) => ({ ...prev, otp: '' }));
                      }}
                    />
                    {formErrors.otp && <p className="text-red-600">{formErrors.otp}</p>}
                  </div>
                  <Button
                    className="mt-4 w-full bg-primary"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    isProcessing={isLoading}
                  >
                    Verify OTP
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <TextInput
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter New Password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setFormErrors((prev) => ({ ...prev, newPassword: '' }));
                      }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <HiEyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <HiEye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {formErrors.newPassword && (
                      <p className="text-red-600">{formErrors.newPassword}</p>
                    )}
                  </div>
                  <div className="relative">
                    <TextInput
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setFormErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <HiEyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <HiEye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {formErrors.confirmPassword && (
                      <p className="text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                  <Button
                    className="mt-4 w-full bg-primary"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                    isProcessing={isLoading}
                  >
                    Reset Password
                  </Button>
                </div>
              )}

              {errorMsg && <div className="text-red-600">{errorMsg}</div>}
              <div className="flex justify-center">
                <Link to="/auth/login">
                  <p className="flex items-center text-primary text-sm mt-5">
                    <IoIosArrowRoundBack className="text-lg mr-1" />
                    Back To Sign in
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

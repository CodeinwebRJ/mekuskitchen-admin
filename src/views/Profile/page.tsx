import { Button, Label, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';

type UserProfile = {
  _id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState<
    Omit<UserProfile, '_id' | 'uniqueId' | 'createdAt' | 'updatedAt' | 'lastLogin'>
  >({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    oldPassword: '',
    newPassword: '',
  });

  const validateForm = () => {
    const newErrors = { ...errors };

    newErrors.name = !formData.name.trim() ? 'Name is required' : '';
    newErrors.email = !formData.email.trim()
      ? 'Email is required'
      : !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
      ? 'Invalid email format'
      : '';
    newErrors.phone = !formData.phone.trim() ? 'Phone number is required' : '';
    newErrors.avatar = !formData.avatar.trim() ? 'Avatar is required' : '';

    const isValid = !newErrors.name && !newErrors.email && !newErrors.phone && !newErrors.avatar;

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const validatePasswordForm = () => {
    const newErrors = { ...errors };

    newErrors.oldPassword = !passwordData.oldPassword.trim() ? 'Old password is required' : '';
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    } else if (!/[A-Z]/.test(passwordData.newPassword) || !/\d/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must include at least one uppercase letter and one number';
    } else {
      newErrors.newPassword = '';
    }

    const isValid = !newErrors.oldPassword && !newErrors.newPassword;

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (stored) {
      try {
        const parsed: UserProfile = JSON.parse(stored);
        setProfile(parsed);
        setFormData({
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          avatar: parsed.avatar,
        });
      } catch (error) {
        console.error('Failed to parse user profile:', error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = () => {
    if (!profile) return;
    if (!validateForm()) return;

    const updatedProfile: UserProfile = {
      ...profile,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handlePasswordSubmit = () => {
    if (!validatePasswordForm()) return;

    console.log('Old Password:', passwordData.oldPassword);
    console.log('New Password:', passwordData.newPassword);

    setPasswordData({ oldPassword: '', newPassword: '' });
    setErrors((prev) => ({ ...prev, oldPassword: '', newPassword: '' }));
    setIsChangingPassword(false);
  };

  if (!profile) {
    return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="flex justify-start px-4 py-8">
      {isEditing ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h2>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <TextInput type="text" name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <TextInput type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label>Phone</Label>
              <TextInput type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div className="flex items-center gap-5">
              <div>
                {formData.avatar && (
                  <div>
                    <img
                      src={formData.avatar}
                      alt="Avatar Preview"
                      className="mt-2 w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                    />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const previewURL = URL.createObjectURL(file);
                      setFormData((prev) => ({ ...prev, avatar: previewURL }));
                    }
                  }}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                />
                {errors.avatar && <p className="text-sm text-red-500 mt-1">{errors.avatar}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button color="primary" onClick={handleUpdate}>
                Save
              </Button>
              <Button color="gray" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : isChangingPassword ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <Label>Old Password</Label>
              <TextInput
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
              />
              {errors.oldPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.oldPassword}</p>
              )}
            </div>
            <div>
              <Label>New Password</Label>
              <TextInput
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button color="primary" onClick={handlePasswordSubmit}>
                Change Password
              </Button>
              <Button color="gray" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="flex flex-col items-center gap-6">
            <img
              className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-md object-cover"
              src={profile.avatar}
              alt="Profile Avatar"
            />
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">ID:</span> {profile.uniqueId}
              </p>
              <div className="text-gray-700 text-base space-y-1 mt-4">
                <p>
                  <span className="font-semibold">Email:</span> {profile.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {profile.phone}
                </p>
                <p>
                  <span className="font-semibold">Joined:</span>{' '}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Last Login:</span>{' '}
                  {new Date(profile.lastLogin).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button color="primary" onClick={() => setIsEditing(true)}>
                  Update Profile
                </Button>
                <Button color="primary" onClick={() => setIsChangingPassword(true)}>
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

interface UserDetail {
  uniqueId: number;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  token?: string;
}

let userDetail: UserDetail | null = null;

if (typeof window !== 'undefined') {
  const getUserDetails = localStorage.getItem('user');

  if (getUserDetails) {
    try {
      userDetail = JSON.parse(getUserDetails) as UserDetail;
    } catch (error) {
      console.error('Failed to parse user details from localStorage:', error);
    }
  }
}

export default userDetail;

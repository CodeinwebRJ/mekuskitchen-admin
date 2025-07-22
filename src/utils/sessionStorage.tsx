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
  const adminString = sessionStorage.getItem('admin');
  const token = sessionStorage.getItem('token');

  if (adminString) {
    try {
      const parsedAdmin = JSON.parse(adminString);
      userDetail = {
        ...parsedAdmin,
        token: token || undefined,
      };
    } catch (error) {
      console.error('Failed to parse user details from sessionStorage:', error);
    }
  }
}

export default userDetail;

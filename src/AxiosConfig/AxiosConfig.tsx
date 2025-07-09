import axios from 'axios';

interface CategoryData {
  name: String;
}
interface SubCategoryData {
  categoryId: String;
  name: String;
}
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const Login = async (data: any) => {
  return axiosInstance.post(`/api/v1/admin/login`, data);
};

export const getCategory = async (data: any) => {
  const { categorySearch, subCategorySearch, productCategorySearch } = data;
  return axiosInstance.get(
    `/api/v1/categories/get/category?categorySearch=${categorySearch}&subCategorySearch=${subCategorySearch}&productCategorySearch=${productCategorySearch}`,
  );
};

export const CreateCategory = async (data: CategoryData) => {
  return axiosInstance.post('/api/v1/categories/add/category', data);
};

export const CreateSubCategory = async (data: SubCategoryData) => {
  return axiosInstance.post('/api/v1/categories/add/subCategory', data);
};

export const CreateSubSubCategory = async (data: any) => {
  return axiosInstance.post('/api/v1/categories/add/subsubCategory', data);
};

export const CreateProduct = async (data: any) => {
  return axiosInstance.post('/api/v1/product/create', data);
};

export const UploadImage = async (files: any) => {
  const formData = new FormData();
  files?.forEach((file: any) => {
    formData.append('images', file);
  });
  return axiosInstance.post('/api/v1/C/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const UpdateCategory = async (data: any) => {
  return axiosInstance.patch('/api/v1/categories/add/category', data);
};

export const UpdateSubCategory = async (data: any) => {
  return axiosInstance.patch('/api/v1/categories/add/subCategory', data);
};

export const UpdateSubSubCategory = async (data: any) => {
  return axiosInstance.patch('/api/v1/categories/add/subsubCategory', data);
};

export const DeleteCategory = async (data: any) => {
  return axiosInstance.delete('/api/v1/categories/delete/category', { data });
};

export const DeleteSubCategory = async (data: any) => {
  return axiosInstance.delete('/api/v1/categories/delete/subcategory', { data });
};

export const DeleteSubSubCategory = async (data: any) => {
  return axiosInstance.delete('/api/v1/categories/delete/subsubcategory', { data });
};

export const getAllCoupons = async (data: any) => {
  const { page, limit, code } = data;
  return axiosInstance.get(`/api/v1/coupon/admin?code=${code}&page=${page}&limit=${limit}`);
};

export const CreateCoupon = async (data: any) => {
  return axiosInstance.post('/api/v1/coupon/admin', data);
};

export const DeleteCoupons = async (data: any) => {
  return axiosInstance.delete('/api/v1/coupon/admin', { data });
};

export const EditCoupons = async (data: any) => {
  return axiosInstance.put('/api/v1/coupon/admin', data);
};

export const getallTax = async (data?: any) => {
  return axiosInstance.get(`/api/v1/tax/get?search=${data?.search}&category=${data?.category}`);
};

export const getAllProduct = async (data: any) => {
  return axiosInstance.post(`/api/v1/product`, data);
};

export const CreateTax = async (data: any) => {
  return axiosInstance.post('/api/v1/tax', data);
};

export const EditTax = async (data: any) => {
  return axiosInstance.put('/api/v1/tax/edit', data);
};

export const DeleteTax = async (data: any) => {
  return axiosInstance.delete(`/api/v1/tax/delete?provinceCode=${data}`);
};

export const getAllOrders = async (data: any) => {
  const { search, startDate, endDate, dateRange, specificDate, orderStatus, orderId } = data;
  const params = new URLSearchParams();
  if (search) params.append('orderId', search);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (dateRange) params.append('dateRange', dateRange);
  if (specificDate) params.append('specificDate', specificDate);
  if (orderStatus) params.append('orderStatus', orderStatus);
  if (orderId) params.append('orderId', orderId);

  return axiosInstance.get(`/api/v1/order/admin/orders?${params.toString()}`);
};

export const SendOtp = async (data: any) => {
  return axiosInstance.get(`/api/v1/admin/otp/${data}`);
};

export const ResetPassword = async (data: any) => {
  return axiosInstance.post('/api/v1/admin/forgot', data);
};

export const EditProduct = async (payload: any) => {
  const { id, data } = payload;
  return axiosInstance.put(`/api/v1/product/category/${id}`, data);
};

export const getProductById = async (data: any) => {
  const { id } = data;
  return axiosInstance.get(`/api/v1/product/${id}`);
};

export const getAllQuarys = async (data: any) => {
  const { search } = data;
  return axiosInstance.get(`/api/v1/contact?search=${search}`);
};

export const DeleteProduct = async (data: any) => {
  return axiosInstance.delete(`/api/v1/product/category/delete/${data}`);
};

export const Createtiffin = async (data: any) => {
  return axiosInstance.post('/api/v1/tiffin-menu/create', data);
};

export const getAllTiffin = async (data: any) => {
  return axiosInstance.post('/api/v1/tiffin-menu/', data);
};

export const getTiffinById = async (id: string) => {
  return axiosInstance.get(`/api/v1/tiffin-menu/${id}`);
};

export const updateTiffin = async (id: string, data: any) => {
  return axiosInstance.put(`/api/v1/tiffin-menu/update/${id}`, data);
};

export const deleteTiffin = async (id: string) => {
  return axiosInstance.delete(`/api/v1/tiffin-menu/delete/${id}`);
};

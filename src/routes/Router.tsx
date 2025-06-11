import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import Loadable from 'src/layouts/full/shared/loadable/Loadable';
import Category from 'src/views/Category/page';
import Coupon from 'src/views/Coupon/page';
import Tax from 'src/views/Tax/page';
import Orders from 'src/views/Orders/page';
import Tiffin from 'src/views/Tiffin/Tiffin';
import SimpleProduct from 'src/views/CreateProduct/SimpleProduct/SimpleProduct';
import VariationsProduct from 'src/views/CreateProduct/VariationProduct/VariationsProduct';
import ProtectedRoute from 'src/components/ProtectedRoute/ProtectedRoute';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const Dashboard = Loadable(lazy(() => import('../views/dashboards/Dashboard')));
const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      {
        path: '/',
        exact: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/product',
        element: (
          <ProtectedRoute>
            <SimpleProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: '/variations-product',
        element: (
          <ProtectedRoute>
            <VariationsProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tiffin',
        element: (
          <ProtectedRoute>
            <Tiffin />
          </ProtectedRoute>
        ),
      },
      {
        path: '/category',
        element: (
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        ),
      },
      {
        path: '/coupon',
        element: (
          <ProtectedRoute>
            <Coupon />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tax',
        element: (
          <ProtectedRoute>
            <Tax />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/login', element: <Login /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);
export default router;

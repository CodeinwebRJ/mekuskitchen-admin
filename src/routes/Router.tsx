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

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const Dashboard = Loadable(lazy(() => import('../views/dashboards/Dashboard')));
const Shadow = Loadable(lazy(() => import('../views/shadows/Shadow')));
const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
const Register = Loadable(lazy(() => import('../views/auth/register/Register')));
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', exact: true, element: <Dashboard /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '/product', element: <SimpleProduct /> },
      { path: '/variations-product', element: <VariationsProduct /> },
      { path: '/tiffin', element: <Tiffin /> },
      { path: '/category', element: <Category /> },
      { path: '/coupon', element: <Coupon /> },
      { path: '/tax', element: <Tax /> },
      { path: '/orders', element: <Orders /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);
export default router;

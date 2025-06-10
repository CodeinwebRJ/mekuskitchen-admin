export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number | string;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

// Static IDs for consistency across renders
const SidebarContent: MenuItem[] = [
  {
    heading: 'HOME',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-add-line-duotone',
        id: 'home-dashboard',
        url: '/',
      },
    ],
  },
  {
    heading: 'UTILITIES',
    children: [
      {
        name: 'Product',
        icon: 'solar:text-circle-outline',
        id: 'util-product',
        url: '/product',
        children: [
          {
            name: 'Simple Product',
            id: 'product-view',
            url: '/product',
            icon: 'solar:text-circle-outline',
          },
          {
            name: 'Variations Product',
            id: 'product-add',
            url: '/variations-product',
            icon: 'solar:text-circle-outline',
          },
        ],
      },
      {
        name: 'Tiffin',
        icon: 'solar:text-circle-outline',
        id: 'util-tiffin',
        url: '/tiffin',
      },
      {
        name: 'Category',
        icon: 'solar:bedside-table-3-linear',
        id: 'util-category',
        url: '/category',
      },
      {
        name: 'Coupon',
        icon: 'solar:bedside-table-3-linear',
        id: 'util-category',
        url: '/coupon',
      },
      {
        name: 'Orders',
        icon: 'solar:bedside-table-3-linear',
        id: 'util-category',
        url: '/orders',
      },
      {
        name: 'Tax',
        icon: 'solar:bedside-table-3-linear',
        id: 'util-category',
        url: '/tax',
      },
    ],
  },
  // {
  //   heading: 'AUTH',
  //   children: [
  //     {
  //       name: 'Login',
  //       icon: 'solar:login-2-linear',
  //       id: 'auth-login',
  //       url: '/auth/login',
  //     },
  //     {
  //       name: 'Register',
  //       icon: 'solar:shield-user-outline',
  //       id: 'auth-register',
  //       url: '/auth/register',
  //     },
  //   ],
  // },
  // {
  //   heading: 'EXTRA',
  //   children: [
  //     {
  //       name: 'Icons',
  //       icon: 'solar:smile-circle-outline',
  //       id: 'extra-icons',
  //       url: '/icons/solar',
  //     },
  //     {
  //       name: 'Sample Page',
  //       icon: 'solar:notes-minimalistic-outline',
  //       id: 'extra-sample',
  //       url: '/sample-page',
  //     },
  //   ],
  // },
];

export default SidebarContent;

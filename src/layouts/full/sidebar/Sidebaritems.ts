export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

type MenuItem = {
  heading?: string;
  name?: string;
  icon?: string;
  id?: string;
  url?: string;
  children?: MenuItem[];
};

const getIconByName = (name: string): string => {
  const iconMap: { [key: string]: string } = {
    Dashboard: 'solar:home-2-linear',
    Product: 'solar:text-circle-outline',
    'Simple Product': 'solar:box-linear',
    'Variations Product': 'solar:layers-minimalistic-linear',
    Category: 'solar:bedside-table-3-linear',
    Coupon: 'solar:ticket-linear',
    Orders: 'solar:cart-large-2-linear',
    Tax: 'solar:calculator-outline',
    Login: 'solar:login-2-linear',
    Register: 'solar:shield-user-outline',
    Icons: 'solar:smile-circle-outline',
    'Sample Page': 'solar:notes-minimalistic-outline',
    'Manage query': 'solar:chat-round-line-duotone',
  };

  return iconMap[name] || 'solar:question-circle-linear';
};

const SidebarContent: MenuItem[] = [
  {
    children: [
      {
        name: 'Dashboard',
        icon: getIconByName('Dashboard'),
        id: 'util-dashboard',
        url: '/',
      },
      {
        name: 'Create Category',
        icon: getIconByName('Category'),
        id: 'util-category',
        url: '/category',
      },
      {
        name: 'Simple Product',
        icon: getIconByName('Simple Product'),
        id: 'util-product',
        children: [
          {
            name: 'Create Simple Product',
            id: 'product-create-simple',
            url: '/create-product',
            icon: getIconByName('Simple Product'),
          },
          {
            name: 'View Simple Product',
            id: 'product-view-simple',
            url: '/simple-product',
            icon: getIconByName('Simple Product'),
          },
        ],
      },
      {
        name: 'Create Variation Product',
        icon: getIconByName('Variations Product'),
        id: 'util-product',
        children: [
          {
            name: 'Create Variation Product',
            id: 'product-create-variation',
            url: '/create-variations-product',
            icon: getIconByName('Variations Product'),
          },
          {
            name: 'View Variation Product',
            id: 'product-view-variation',
            url: '/variations-product',
            icon: getIconByName('Variations Product'),
          },
        ],
      },
      {
        name: 'Manage Tiffin',
        icon: getIconByName('Product'),
        id: 'util-tiffin',
        children: [
          {
            name: 'Create Tiffin',
            id: 'tiffin-create',
            url: '/create-tiffin',
            icon: getIconByName('Product'),
          },
          {
            name: 'View Tiffin',
            id: 'tiffin-view',
            url: '/tiffin',
            icon: getIconByName('Product'),
          },
        ],
      },
      {
        name: 'Daily Tiffin Orders',
        icon: getIconByName('Orders'),
        id: 'util-daily-tiffin',
        url: '/daily-tiffin',
      },
      {
        name: 'Orders',
        icon: getIconByName('Orders'),
        id: 'util-orders',
        url: '/orders',
      },
      {
        name: 'Create Coupon',
        icon: getIconByName('Coupon'),
        id: 'util-coupon',
        url: '/coupon',
      },
      {
        name: 'Manage Tax',
        icon: getIconByName('Tax'),
        id: 'util-tax',
        url: '/tax',
      },
      {
        name: 'Manage Query',
        icon: getIconByName('Manage query'),
        id: 'util-query',
        url: '/query',
      },
    ],
  },
];

export default SidebarContent;

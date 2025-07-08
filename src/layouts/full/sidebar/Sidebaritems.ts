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
    Dashboard: 'solar:widget-add-line-duotone',
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
    'Manage Quarry': 'solar:chat-round-line-duotone',
  };

  return iconMap[name] || 'solar:question-circle-linear';
};

const SidebarContent: MenuItem[] = [
  {
    children: [
      {
        name: 'Products',
      },
      {
        name: 'Products',
        icon: getIconByName('Simple Product'),
        id: 'util-product',
        children: [
          {
            name: 'Products',
            id: 'util-category',
            url: '/',
            icon: getIconByName('Simple Product'),
          },
          {
            name: 'Variations Products',
            id: 'product-add',
            url: '/variations-product',
            icon: getIconByName('Variations Product'),
          },
        ],
      },
      {
        name: 'Create Product',
        icon: getIconByName('Product'),
        id: 'util-product',
        children: [
          {
            name: 'Simple Product',
            id: 'product-view',
            url: '/create-product',
            icon: getIconByName('Simple Product'),
          },
          {
            name: 'Variations Product',
            id: 'product-add',
            url: '/create-variations-product',
            icon: getIconByName('Variations Product'),
          },
        ],
      },
      // {
      //   name: 'Tiffin',
      //   icon: getIconByName('Category'),
      //   id: 'util-category',
      //   url: '/tiffin',
      // },
      {
        name: 'Create Tiffin',
        icon: getIconByName('Category'),
        id: 'util-category',
        url: '/create-tiffin',
      },
      {
        name: 'Create Category',
        icon: getIconByName('Category'),
        id: 'util-category',
        url: '/category',
      },
      {
        name: 'Create Coupon',
        icon: getIconByName('Coupon'),
        id: 'util-coupon',
        url: '/coupon',
      },
      {
        name: 'Orders',
        icon: getIconByName('Orders'),
        id: 'util-orders',
        url: '/orders',
      },
      {
        name: 'Manage Tax',
        icon: getIconByName('Tax'),
        id: 'util-tax',
        url: '/tax',
      },
      {
        name: 'Manage Quarry',
        icon: getIconByName('Manage Quarry'),
        id: 'util-tax',
        url: '/quarry',
      },
    ],
  },
];

export default SidebarContent;

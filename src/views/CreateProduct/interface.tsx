export interface Image {
  file: File;
  url: string;
  isPrimary: boolean;
}

export interface Dimensions {
  length: string;
  width: string;
  height: string;
  dimensionUnit: string;
}

export interface CombinationField {
  name: string;
  type: any;
  options?: string[];
}

export interface Variant {
  Name: string;
  Stock: number;
  Price: number;
  SKUname: string;
  [key: string]: string | boolean | number | (string | File)[];
}

export interface VariantField {
  name: string;
  type: 'string' | 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'image';
  options?: string[];
  isDefault?: boolean;
}

export interface Combination {
  [key: string]: string | boolean | number | (string | File)[];
}

export interface ProductSchema {
  name: string;
  price: string;
  sellingPrice: string;
  currency: string;
  description: string;
  shortDescription: string;
  images: string[];
  discount: string;
  stock: string;
  category: string;
  SKUName: string;
  subCategory: string;
  manageInventory: boolean;
  subsubCategory: string;
  brand: string;
  weight: string;
  weightUnit: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
    dimensionUnit: string;
  };
  tags: string[];
  specifications: Record<string, any>;
  features: string[];
  aboutItem: string[];
  skuFields: VariantField[];
  combinationFields: CombinationField[];
  sku?: any;
}

export interface BasicInfoProps {
  product: any;
  setProduct: any;
  errors?: any;
  setErrors?: any;
}

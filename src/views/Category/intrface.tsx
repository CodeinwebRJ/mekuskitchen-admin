interface SubSubCategoryType {
  _id: string;
  name: string;
  isActive: boolean;
}

interface SubCategoryType {
  _id: string;
  name: string;
  subSubCategories: SubSubCategoryType[];
  isActive: boolean;
}

interface CategoryType {
  _id: string;
  name: string;
  subCategories: SubCategoryType[];
  isActive: boolean;
}
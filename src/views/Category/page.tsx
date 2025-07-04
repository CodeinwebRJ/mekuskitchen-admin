import { Button } from 'flowbite-react';
import { useState } from 'react';
import Category from './Category';
import ProductCategory from './ProductCategory';
import SubCategory from './SubCategory';

const Page = () => {
  const [activeView, setActiveView] = useState<'category' | 'subcategory' | 'productcategory'>(
    'category',
  );

  const handleViewChange = (view: 'category' | 'subcategory' | 'productcategory') => {
    setActiveView(view);
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3">Categories</h2>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
        <Button
          onClick={() => handleViewChange('category')}
          size="md"
          color={activeView === 'category' ? 'primary' : 'gray'}
          className="rounded w-full sm:w-auto"
        >
          Category
        </Button>
        <Button
          onClick={() => handleViewChange('subcategory')}
          size="md"
          color={activeView === 'subcategory' ? 'primary' : 'gray'}
          className="rounded w-full sm:w-auto"
        >
          SubCategory
        </Button>
        <Button
          onClick={() => handleViewChange('productcategory')}
          size="md"
          color={activeView === 'productcategory' ? 'primary' : 'gray'}
          className="rounded w-full sm:w-auto"
        >
          Product Category
        </Button>
      </div>

      {activeView === 'category' && <Category />}
      {activeView === 'subcategory' && <SubCategory />}
      {activeView === 'productcategory' && <ProductCategory />}
    </div>
  );
};

export default Page;

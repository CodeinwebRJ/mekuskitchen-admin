import { Button, Card, Label, Select, TextInput } from 'flowbite-react';
import React, { useState, FormEvent, useCallback } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { BasicInfoProps, Combination, CombinationField, Variant, VariantField } from '../interface';

interface NewField {
  name?: string;
  type?: 'string' | 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'image';
  options?: string;
}

const SKU: React.FC<BasicInfoProps> = ({ product, setProduct }) => {
  const [newVariantField, setNewVariantField] = useState<any>({
    name: '',
    type: 'text',
    options: '',
  });
  const [newCombinationField, setNewCombinationField] = useState<any>({
    name: '',
    type: 'text',
    options: '',
  });

  const hasImageField =
    product.skuFields.some((field: any) => field.type === 'image') ||
    product.combinationFields.some((field: any) => field.type === 'image');

  const handleNewVariantFieldChange = useCallback((field: keyof NewField, value: string) => {
    setNewVariantField((prev: any) => {
      if (field === 'type' && value === 'image') {
        return { ...prev, type: value, name: 'SKUImage' };
      } else if (field === 'type' && prev.type === 'image') {
        return { ...prev, type: value, name: '' };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const handleNewCombinationFieldChange = useCallback((field: keyof NewField, value: string) => {
    setNewCombinationField((prev: any) => {
      if (field === 'type' && value === 'image') {
        return { ...prev, type: value, name: 'CombinationImage' };
      } else if (field === 'type' && prev.type === 'image') {
        return { ...prev, type: value, name: '' };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const addVariantField = (e: FormEvent) => {
    e.preventDefault();
    const fieldName = newVariantField.type === 'image' ? 'SKUImage' : newVariantField.name?.trim();
    if (!fieldName) {
      return;
    }
    if (product.skuFields.some((field: any) => field.name === fieldName)) {
      return;
    }
    if (newVariantField.type === 'select' && !newVariantField.options?.trim()) {
      return;
    }
    if (newVariantField.type === 'image' && hasImageField) {
      return;
    }
    const field: VariantField = {
      name: fieldName,
      type: newVariantField.type,
      ...(newVariantField.type === 'select' && {
        options: newVariantField.options
          .split(',')
          .map((opt: any) => opt.trim())
          .filter((opt: any) => opt),
      }),
    };
    const updatedVariants = product.sku?.map((variant: any) => ({
      ...variant,
      [field.name]:
        field.type === 'checkbox'
          ? false
          : field.type === 'number'
          ? 0
          : field.type === 'color'
          ? '#000000'
          : field.type === 'image'
          ? []
          : '',
    }));
    setProduct({
      ...product,
      skuFields: [...product.skuFields, field],
      sku: updatedVariants?.length
        ? updatedVariants
        : [
            {
              Name: '',
              Stock: 0,
              Price: 0,
              SKUname: '',
              combinations: [],
              ...(field.type === 'checkbox'
                ? { [field.name]: false }
                : field.type === 'number'
                ? { [field.name]: 0 }
                : field.type === 'color'
                ? { [field.name]: '#000000' }
                : field.type === 'image'
                ? { [field.name]: [] }
                : { [field.name]: '' }),
            },
          ],
    });
    setNewVariantField({ name: '', type: 'text', options: '' });
  };

  const addCombinationField = (e: FormEvent) => {
    e.preventDefault();
    const fieldName =
      newCombinationField.type === 'image' ? 'CombinationImage' : newCombinationField.name?.trim();
    if (!fieldName) {
      return;
    }
    if (product.combinationFields.some((field: any) => field.name === fieldName)) {
      return;
    }
    if (newCombinationField.type === 'select' && !newCombinationField.options?.trim()) {
      return;
    }
    if (newCombinationField.type === 'image' && hasImageField) {
      return;
    }
    const field: CombinationField = {
      name: fieldName,
      type: newCombinationField.type,
      ...(newCombinationField.type === 'select' && {
        options: newCombinationField?.options
          .split(',')
          .map((opt: any) => opt.trim())
          .filter((opt: any) => opt),
      }),
    };
    const updatedVariants = product.sku?.map((variant: any) => ({
      ...variant,
      combinations: variant.combinations.map((comb: any) => ({
        ...comb,
        [field.name]:
          field.type === 'checkbox'
            ? false
            : field.type === 'number'
            ? 0
            : field.type === 'color'
            ? '#000000'
            : field.type === 'image'
            ? []
            : '',
      })),
    }));
    setProduct({
      ...product,
      combinationFields: [...product.combinationFields, field],
      sku: updatedVariants,
    });
    setNewCombinationField({ name: '', type: 'text', options: '' });
  };

  const removeVariantField = (fieldName: string) => {
    const updatedVariants = product.sku?.map((variant: any) => {
      const { [fieldName]: _, ...rest } = variant;
      return rest as Variant & { combinations: Combination[] };
    });
    setProduct({
      ...product,
      skuFields: product.skuFields.filter((field: any) => field.name !== fieldName),
      sku: updatedVariants,
    });
  };

  const removeCombinationField = (fieldName: string) => {
    const updatedVariants = product.sku?.map((variant: any) => ({
      ...variant,
      combinations: variant.combinations.map((comb: any) => {
        const { [fieldName]: _, ...rest } = comb;
        return rest as Combination;
      }),
    }));
    setProduct({
      ...product,
      combinationFields: product.combinationFields.filter((field: any) => field.name !== fieldName),
      sku: updatedVariants,
    });
  };

  const handleImageUpload = (
    index: number,
    fieldName: string,
    event: React.ChangeEvent<HTMLInputElement>,
    isCombination: boolean = false,
    combinationIndex?: number,
  ) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const updatedVariants = [...product?.sku];
      if (isCombination && combinationIndex !== undefined) {
        const currentFiles =
          (updatedVariants[index].combinations[combinationIndex][fieldName] as File[]) || [];
        updatedVariants[index].combinations[combinationIndex] = {
          ...updatedVariants[index].combinations[combinationIndex],
          [fieldName]: [...currentFiles, ...fileArray],
        };
      } else {
        const currentFiles = (updatedVariants[index][fieldName] as File[]) || [];
        updatedVariants[index] = {
          ...updatedVariants[index],
          [fieldName]: [...currentFiles, ...fileArray],
        };
      }
      setProduct({ ...product, sku: updatedVariants });
    }
  };

  const removeImage = (
    variantIndex: number,
    fieldName: string,
    imageIndex: number,
    isCombination: boolean = false,
    combinationIndex?: number,
  ) => {
    const updatedVariants = [...product.sku];
    if (isCombination && combinationIndex !== undefined) {
      const currentImages =
        (updatedVariants[variantIndex].combinations[combinationIndex][fieldName] as (
          | string
          | File
        )[]) || [];
      updatedVariants[variantIndex].combinations[combinationIndex] = {
        ...updatedVariants[variantIndex].combinations[combinationIndex],
        [fieldName]: currentImages.filter((_, i: number) => i !== imageIndex),
      };
    } else {
      const currentImages = (updatedVariants[variantIndex][fieldName] as (string | File)[]) || [];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        [fieldName]: currentImages.filter((_, i: number) => i !== imageIndex),
      };
    }
    setProduct({ ...product, sku: updatedVariants });
  };

  const handleVariantChange = (
    index: number,
    fieldName: string,
    value: string | boolean | number,
  ) => {
    const field = product.skuFields.find((f: any) => f.name === fieldName);
    const updatedVariants = [...product.sku];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [fieldName]:
        field?.type === 'number'
          ? typeof value === 'string'
            ? parseFloat(value) || 0
            : value
          : value,
    };
    setProduct({ ...product, sku: updatedVariants });
  };

  const handleCombinationChange = (
    variantIndex: number,
    combinationIndex: number,
    fieldName: string,
    value: string | boolean | number,
  ) => {
    const field = product.combinationFields.find((f: any) => f.name === fieldName) || {
      name: fieldName,
      type: 'number' as const,
    };
    const updatedVariants = [...product?.sku];
    updatedVariants[variantIndex].combinations[combinationIndex] = {
      ...updatedVariants[variantIndex].combinations[combinationIndex],
      [fieldName]:
        field.type === 'number'
          ? typeof value === 'string'
            ? parseFloat(value) || 0
            : value
          : value,
    };
    setProduct({ ...product, sku: updatedVariants });
  };

  const addVariant = () => {
    const newVariant: Variant & { combinations: Combination[] } = {
      Name: '',
      Stock: 0,
      Price: 0,
      SKUname: '',
      combinations: [],
    };
    product.skuFields.forEach((field: any) => {
      if (!field.isDefault) {
        newVariant[field.name] =
          field.type === 'checkbox'
            ? false
            : field.type === 'number'
            ? 0
            : field.type === 'color'
            ? '#000000'
            : field.type === 'image'
            ? []
            : '';
      }
    });
    setProduct({
      ...product,
      sku: [...product?.sku, newVariant],
    });
  };

  const addCombination = (variantIndex: number) => {
    const newCombination: Combination = {
      Price: 0,
      Stock: 0,
    };
    product.combinationFields.forEach((field: any) => {
      newCombination[field.name] =
        field.type === 'checkbox'
          ? false
          : field.type === 'number'
          ? 0
          : field.type === 'color'
          ? '#000000'
          : field.type === 'image'
          ? []
          : '';
    });
    const updatedVariants = [...product.sku];
    updatedVariants[variantIndex].combinations.push(newCombination);
    setProduct({ ...product, sku: updatedVariants });
  };

  const removeVariant = (index: number) => {
    if (product.sku?.length === 1) {
      return;
    }
    const updatedVariants = product.sku?.filter((_: any, i: number) => i !== index);
    setProduct({ ...product, sku: updatedVariants });
  };

  const removeCombination = (variantIndex: number, combinationIndex: number) => {
    const updatedVariants = [...product.sku];
    updatedVariants[variantIndex].combinations = updatedVariants[variantIndex].combinations.filter(
      (_: any, i: number) => i !== combinationIndex,
    );
    setProduct({ ...product, sku: updatedVariants });
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Product</h1>
      <form className="space-y-4">
        <div className="flex items-start gap-4">
          <Card className="w-full p-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Variant Fields</h2>
            <div className="flex gap-4 items-center">
              <div>
                <Label value="Field Name" className="text-sm font-medium text-gray-700" />
                <TextInput
                  id="variant-field-name"
                  type="text"
                  value={newVariantField.name}
                  onChange={(e) => handleNewVariantFieldChange('name', e.target.value)}
                  placeholder="e.g., Color"
                  className="!rounded-none"
                />
              </div>
              <div>
                <Label value="Field Type" className="text-sm font-medium text-gray-700" />
                <Select
                  id="variant-field-type"
                  value={newVariantField.type}
                  onChange={(e) => handleNewVariantFieldChange('type', e.target.value)}
                  className="mt-1"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="color">Color Picker</option>
                  <option value="image" disabled={hasImageField}>
                    Image
                  </option>
                </Select>
              </div>
              {newVariantField.type === 'select' && (
                <div>
                  <Label
                    value="Options (comma-separated)"
                    className="text-sm font-medium text-gray-700"
                  />
                  <TextInput
                    id="variant-field-options"
                    type="text"
                    value={newVariantField.options}
                    onChange={(e) => handleNewVariantFieldChange('options', e.target.value)}
                    placeholder="e.g., Red, Blue, Green"
                    className="mt-1"
                  />
                </div>
              )}
              <div className="flex items-end mt-5">
                <Button color="blue" type="button" size="sm" onClick={addVariantField}>
                  Add Variant Field
                </Button>
              </div>
            </div>
            {product.skuFields.filter((field: any) => !field.isDefault).length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Variant Fields</h3>
                <ul className="flex gap-4 flex-wrap">
                  {product.skuFields
                    .filter((field: any) => !field.isDefault)
                    .map((field: any) => (
                      <li
                        key={field.name}
                        className="flex gap-4 items-center justify-between p-2 rounded-md transition-colors bg-blue-50 duration-300 text-black"
                      >
                        <span>
                          {field.name} ({field.type})
                        </span>
                        <Button
                          type="button"
                          onClick={() => removeVariantField(field.name)}
                          color="failure"
                          size="xs"
                          className="p-0"
                        >
                          <RiDeleteBinLine />
                        </Button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </Card>

          <Card className="w-full p-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Combination Fields</h2>
            <div className="flex gap-4 items-center">
              <div>
                <Label value="Field Name" className="text-sm font-medium text-gray-700" />
                <TextInput
                  id="combination-field-name"
                  type="text"
                  value={newCombinationField.name}
                  onChange={(e) => handleNewCombinationFieldChange('name', e.target.value)}
                  placeholder="e.g., Storage"
                  className="!rounded-none"
                />
              </div>
              <div>
                <Label value="Field Type" className="text-sm font-medium text-gray-700" />
                <Select
                  id="combination-field-type"
                  value={newCombinationField.type}
                  onChange={(e) => handleNewCombinationFieldChange('type', e.target.value)}
                  className="mt-1"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                </Select>
              </div>
              {newCombinationField.type === 'select' && (
                <div>
                  <Label
                    value="Options (comma-separated)"
                    className="text-sm font-medium text-gray-700"
                  />
                  <TextInput
                    id="combination-field-options"
                    type="text"
                    value={newCombinationField.options}
                    onChange={(e) => handleNewCombinationFieldChange('options', e.target.value)}
                    placeholder="e.g., 64GB, 128GB, 256GB"
                    className="mt-1"
                  />
                </div>
              )}
              <div className="flex items-end mt-5">
                <Button color="blue" type="button" size="sm" onClick={addCombinationField}>
                  Add Combination
                </Button>
              </div>
            </div>

            {product.combinationFields.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Combination Fields</h3>
                <ul className="flex gap-4 flex-wrap">
                  {product.combinationFields.map((field: any) => (
                    <li
                      key={field.name}
                      className="flex gap-4 items-center justify-between p-2 rounded-md transition-colors bg-blue-50 duration-300 text-black"
                    >
                      <span>
                        {field.name} ({field.type})
                      </span>
                      <Button
                        type="button"
                        onClick={() => removeCombinationField(field.name)}
                        color="failure"
                        size="xs"
                        className="p-0"
                      >
                        <RiDeleteBinLine />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Variants</h2>
          {product.sku?.map((variant: any, index: number) => (
            <Card key={index} className="p-4 mb-6 bg-white border rounded-lg duration-300">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Variant {index + 1}</h3>
              <div className="flex justify-between items-end">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {product.skuFields.map((field: any) => (
                    <div key={field.name} className="flex flex-col">
                      <Label
                        htmlFor={`${field.name}-${index}`}
                        value={field.name}
                        className="text-sm font-semibold text-gray-800 mb-2"
                      />
                      {field.type === 'text' && (
                        <TextInput
                          id={`${field.name}-${index}`}
                          type="text"
                          value={(variant[field.name] as string) || ''}
                          onChange={(e) => handleVariantChange(index, field.name, e.target.value)}
                          placeholder={`Enter ${field.name}`}
                          className="mt-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                      )}
                      {field.type === 'number' && (
                        <TextInput
                          id={`${field.name}-${index}`}
                          type="text"
                          value={(variant[field.name] as string) ?? ''}
                          onChange={(e) => handleVariantChange(index, field.name, e.target.value)}
                          placeholder={`Enter ${field.name}`}
                          readOnly
                          step={field.name === 'Price' ? '0.01' : '1'}
                          className="mt-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                      )}
                      {field.type === 'select' && (
                        <Select
                          id={`${field.name}-${index}`}
                          value={(variant[field.name] as string) || ''}
                          onChange={(e) => handleVariantChange(index, field.name, e.target.value)}
                          className="mt-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          <option value="">Select {field.name}</option>
                          {field.options?.map((option: any) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      )}
                      {field.type === 'checkbox' && (
                        <div className="flex items-center mt-3">
                          <input
                            type="checkbox"
                            id={`${field.name}-${index}`}
                            checked={(variant[field.name] as boolean) ?? false}
                            onChange={(e) =>
                              handleVariantChange(index, field.name, e.target.checked)
                            }
                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors"
                          />
                          <label
                            htmlFor={`${field.name}-${index}`}
                            className="ml-3 text-sm font-medium text-gray-700"
                          >
                            {field.name}
                          </label>
                        </div>
                      )}
                      {field.type === 'color' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id={`${field.name}-${index}`}
                            value={
                              /^#[0-9A-Fa-f]{6}$/.test(variant[field.name] as string)
                                ? (variant[field.name] as string)
                                : '#000000'
                            }
                            onChange={(e) => handleVariantChange(index, field.name, e.target.value)}
                            className="h-10 w-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          />
                          <TextInput
                            id={`${field.name}-hex-${index}`}
                            type="text"
                            value={variant[field.name] as string}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                handleVariantChange(index, field.name, value);
                              }
                            }}
                            placeholder="#RRGGBB"
                            className="mt-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors w-24"
                          />
                        </div>
                      )}
                      {field.type === 'image' && (
                        <div className="flex flex-col gap-2">
                          {(variant[field.name] as (string | File)[])?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(variant[field.name] as (string | File)[]).map((image, imgIndex) => {
                                const imageSrc =
                                  image instanceof File ? URL.createObjectURL(image) : image;
                                return (
                                  <div key={imgIndex} className="relative">
                                    <img
                                      src={imageSrc}
                                      alt={`${field.name} preview ${imgIndex + 1}`}
                                      className="h-16 w-16 object-cover rounded-md"
                                      onError={(e) => {
                                        console.error(`Failed to load image: ${imageSrc}`);
                                        e.currentTarget.src = '/fallback-image.png';
                                      }}
                                      onLoad={() => {
                                        if (image instanceof File) {
                                          URL.revokeObjectURL(imageSrc);
                                        }
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => removeImage(index, field.name, imgIndex)}
                                      color="failure"
                                      size="xs"
                                      className="absolute p-0 top-1 right-0 bg-red-500 hover:bg-red-600 text-white rounded"
                                    >
                                      <RiDeleteBinLine />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <input
                            type="file"
                            id={`${field.name}-${index}`}
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(index, field.name, e)}
                            className="mt-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-1/3 flex justify-end">
                  <Button
                    color="blue"
                    type="button"
                    onClick={() => addCombination(index)}
                    size="sm"
                    className="mb-1"
                  >
                    Add Combination
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-2">Combinations</h4>
                {variant.combinations.map((combination: any, combIndex: number) => (
                  <div
                    key={combIndex}
                    className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {product.combinationFields.map((field: any) => (
                          <div key={field.name} className="flex flex-col">
                            <Label
                              htmlFor={`${field.name}-${index}-${combIndex}`}
                              value={field.name}
                              className="text-sm font-semibold text-gray-800 mb-2"
                            />
                            {field.type === 'text' && (
                              <TextInput
                                id={`${field.name}-${index}-${combIndex}`}
                                type="text"
                                value={(combination[field.name] as string) || ''}
                                onChange={(e) =>
                                  handleCombinationChange(
                                    index,
                                    combIndex,
                                    field.name,
                                    e.target.value,
                                  )
                                }
                                placeholder={`Enter ${field.name}`}
                                className="mt-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                              />
                            )}
                            {field.type === 'number' && (
                              <TextInput
                                id={`${field.name}-${index}-${combIndex}`}
                                type="text"
                                value={(combination[field.name] as string) ?? ''}
                                onChange={(e) =>
                                  handleCombinationChange(
                                    index,
                                    combIndex,
                                    field.name,
                                    e.target.value,
                                  )
                                }
                                placeholder={`Enter ${field.name}`}
                                min="0"
                                step="1"
                                className="mt-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                              />
                            )}
                            {field.type === 'select' && (
                              <Select
                                id={`${field.name}-${index}-${combIndex}`}
                                value={(combination[field.name] as string) || ''}
                                onChange={(e) =>
                                  handleCombinationChange(
                                    index,
                                    combIndex,
                                    field.name,
                                    e.target.value,
                                  )
                                }
                                className="mt-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                              >
                                <option value="">Select {field.name}</option>
                                {field.options?.map((option: any) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Select>
                            )}
                            {field.type === 'checkbox' && (
                              <div className="flex items-center mt-3">
                                <input
                                  type="checkbox"
                                  id={`${field.name}-${index}-${combIndex}`}
                                  checked={(combination[field.name] as boolean) ?? false}
                                  onChange={(e) =>
                                    handleCombinationChange(
                                      index,
                                      combIndex,
                                      field.name,
                                      e.target.checked,
                                    )
                                  }
                                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors"
                                />
                                <label
                                  htmlFor={`${field.name}-${index}-${combIndex}`}
                                  className="ml-3 text-sm font-medium text-gray-700"
                                >
                                  {field.name}
                                </label>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex flex-col">
                          <Label
                            htmlFor={`Stock-${index}-${combIndex}`}
                            value="Stock"
                            className="text-sm font-semibold text-gray-800 mb-2"
                          />
                          <TextInput
                            id={`Stock-${index}-${combIndex}`}
                            type="text"
                            value={(combination.Stock as string) ?? ''}
                            onChange={(e) =>
                              handleCombinationChange(index, combIndex, 'Stock', e.target.value)
                            }
                            placeholder="Enter Stock"
                            min="0"
                            step="1"
                            className="mt-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        <div className="flex flex-col">
                          <Label
                            htmlFor={`Price-${index}-${combIndex}`}
                            value="Price"
                            className="text-sm font-semibold text-gray-800 mb-2"
                          />
                          <TextInput
                            id={`Price-${index}-${combIndex}`}
                            type="text"
                            value={(combination.Price as string) ?? ''}
                            onChange={(e) =>
                              handleCombinationChange(index, combIndex, 'Price', e.target.value)
                            }
                            placeholder="Enter Price"
                            min="0"
                            step="0.01"
                            className="mt-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          onClick={() => removeCombination(index, combIndex)}
                          color="failure"
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                        >
                          <RiDeleteBinLine size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {index > 0 && (
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    onClick={() => removeVariant(index)}
                    color="failure"
                    size="sm"
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                  >
                    <RiDeleteBinLine size={20} />
                  </Button>
                </div>
              )}
            </Card>
          ))}
          <Button
            color="blue"
            type="button"
            onClick={addVariant}
            className="mt-4 transition-transform transform hover:scale-105"
          >
            Add Variant
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SKU;

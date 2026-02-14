import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getProducts, addProduct, deleteProduct, Product, getSchools, School } from '../../db';

// --- ICONS ---
const icons = {
    list: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
    add: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    copy: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    print: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
    edit: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    delete: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    save: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
};

const ProductList = ({ products, onProductDeleted }: { products: Product[], onProductDeleted: () => void }) => {
    
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            onProductDeleted();
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{icons.copy}</button>
                    <button className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{icons.print}</button>
                </div>
                <div className="relative">
                    <input type="text" placeholder="Search..." className="pl-4 pr-10 py-2 w-full md:w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <svg className="h-5 w-5 text-gray-400 absolute top-1/2 right-3 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {['SI', 'School', 'Name', 'Code', 'Category', 'Purchase Unit', 'Sale Unit', 'Unit Ratio', 'Purchase Price', 'Sales Price', 'Remarks', 'Action'].map(head => (
                      <th key={head} className="p-3 font-semibold text-sm text-text-secondary dark:text-gray-300 uppercase tracking-wider">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="p-3 text-sm text-text-secondary dark:text-gray-400">{index + 1}</td>
                      <td className="p-3 text-sm text-text-primary dark:text-gray-200">{product.school}</td>
                      <td className="p-3 text-sm text-text-primary dark:text-gray-200 font-medium">{product.name}</td>
                      <td className="p-3 text-sm text-text-secondary dark:text-gray-400">{product.code}</td>
                      <td className="p-3 text-sm text-text-secondary dark:text-gray-400">{product.category}</td>
                      <td className="p-3 text-sm text-text-secondary dark:text-gray-400">{product.purchaseUnit}</td>
                      <td className="p-3 text-sm text-text-secondary dark:text-gray-400">{product.saleUnit}</td>
                      <td className="p-3 text-sm text-text-secondary dark:text-gray-400">{product.unitRatio}</td>
                      <td className="p-3 text-sm text-text-secondary dark:text-gray-400">${product.purchasePrice.toFixed(2)}</td>
                      <td className="p-3 text-sm text-text-secondary dark:text-gray-400">${product.salesPrice.toFixed(2)}</td>
                      <td className="p-3 text-sm text-text-secondary dark:text-gray-400">{product.remarks}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors" aria-label="Edit product">{icons.edit}</button>
                          <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors" aria-label="Delete product">{icons.delete}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-text-secondary dark:text-gray-400">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <span>Showing 1 to {products.length} of {products.length} entries</span>
                    <select className="px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600">
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                    <span>rows per page</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50" disabled>&lt;</button>
                    <button className="px-3 py-1 border rounded-md bg-primary text-white">1</button>
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50" disabled>&gt;</button>
                </div>
            </div>
        </>
    );
};

const FormField = ({ label, name, type = 'text', required = false, placeholder = '', children }: { label: string, name: string, type?: string, required?: boolean, placeholder?: string, children?: React.ReactNode }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children ? (
            <div className="relative">
                {children}
            </div>
        ) : (
            <input
                type={type}
                id={name}
                name={name}
                required={required}
                placeholder={placeholder}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
        )}
    </div>
);

const CustomDropdown = ({
    id,
    name,
    options,
    placeholder,
    onSelect,
    disabled = false,
    isOpen,
    setIsOpen
}: {
    id: string;
    name: string;
    options: { value: string; label: string }[];
    placeholder: string;
    onSelect: (value: string) => void;
    disabled?: boolean;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                type="button"
                id={id}
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 150)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
                {selectedValue || placeholder}
            </button>
            {isOpen && !disabled && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700">
                    {options.map(option => (
                        <a
                            key={option.value}
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleSelect(option.value); }}
                            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                        >
                            {option.label}
                        </a>
                    ))}
                </div>
            )}
            <input type="hidden" name={name} value={selectedValue} />
        </div>
    );
};

const CreateProductForm = ({ onProductAdded }: { onProductAdded: () => void }) => {
    const [schools, setSchools] = useState<School[]>([]);
    const [loadingSchools, setLoadingSchools] = useState(true);
    const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [purchaseUnitDropdownOpen, setPurchaseUnitDropdownOpen] = useState(false);
    const [saleUnitDropdownOpen, setSaleUnitDropdownOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState('');

    useEffect(() => {
        const fetchSchools = async () => {
            setLoadingSchools(true);
            const schoolsData = await getSchools();
            setSchools(schoolsData);
            setLoadingSchools(false);
        };
        fetchSchools();
    }, []);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const newProduct: Omit<Product, 'id' | 'school_id'> = {
            school: formData.get('school') as string,
            name: formData.get('name') as string,
            code: formData.get('code') as string,
            category: formData.get('category') as string,
            purchaseUnit: formData.get('purchaseUnit') as string,
            saleUnit: formData.get('saleUnit') as string,
            unitRatio: Number(formData.get('unitRatio')),
            purchasePrice: Number(formData.get('purchasePrice')),
            salesPrice: Number(formData.get('salesPrice')),
            remarks: formData.get('remarks') as string,
        };
        await addProduct(newProduct);
        form.reset();
        onProductAdded();
    };

    const schoolOptions = schools.map(school => ({ value: school.name, label: school.name }));

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField label="School" name="school" required>
                    <CustomDropdown
                        id="school"
                        name="school"
                        options={schoolOptions}
                        placeholder={loadingSchools ? 'Loading...' : 'Select'}
                        disabled={loadingSchools}
                        isOpen={schoolDropdownOpen}
                        setIsOpen={setSchoolDropdownOpen}
                        onSelect={setSelectedSchool}
                    />
                </FormField>
                <FormField label="Product Name" name="name" required />
                <FormField label="Product Code" name="code" required />
                <FormField label="Product Category" name="category" required placeholder="First Select The School">
                    <CustomDropdown
                        id="category"
                        name="category"
                        options={[
                            { value: 'Electronics', label: 'Electronics' },
                            { value: 'Stationary', label: 'Stationary' },
                            { value: 'Books', label: 'Books' },
                            { value: 'Furniture', label: 'Furniture' },
                        ]}
                        placeholder="First Select The School"
                        disabled={!selectedSchool}
                        isOpen={categoryDropdownOpen}
                        setIsOpen={setCategoryDropdownOpen}
                        onSelect={() => {}}
                    />
                </FormField>
                <FormField label="Purchase Unit" name="purchaseUnit" required placeholder="First Select The School">
                    <CustomDropdown
                        id="purchaseUnit"
                        name="purchaseUnit"
                        options={[
                            { value: 'KG', label: 'KG' },
                            { value: 'Piece', label: 'Piece' },
                            { value: 'Box', label: 'Box' },
                            { value: 'Carton', label: 'Carton' },
                        ]}
                        placeholder="First Select The School"
                        disabled={!selectedSchool}
                        isOpen={purchaseUnitDropdownOpen}
                        setIsOpen={setPurchaseUnitDropdownOpen}
                        onSelect={() => {}}
                    />
                </FormField>
                <FormField label="Sales Unit" name="saleUnit" required placeholder="First Select The School">
                    <CustomDropdown
                        id="saleUnit"
                        name="saleUnit"
                        options={[
                            { value: 'Gram', label: 'Gram' },
                            { value: 'Piece', label: 'Piece' },
                            { value: 'Pack', label: 'Pack' },
                            { value: 'Unit', label: 'Unit' },
                        ]}
                        placeholder="First Select The School"
                        disabled={!selectedSchool}
                        isOpen={saleUnitDropdownOpen}
                        setIsOpen={setSaleUnitDropdownOpen}
                        onSelect={() => {}}
                    />
                </FormField>
                <FormField label="Unit Ratio" name="unitRatio" required placeholder="Eg. Purchase Unit : KG & Sales Unit : Gram = Ratio : 1000" />
                <FormField label="Purchase Price" name="purchasePrice" type="number" required />
                <FormField label="Sales Price" name="salesPrice" type="number" required />
                <FormField label="Remarks" name="remarks" />
            </div>

            <div className="pt-4 border-t dark:border-gray-700 flex justify-end">
                <button type="submit" className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-hover disabled:opacity-50 transition-colors">
                    {icons.save}
                    Save
                </button>
            </div>
        </form>
    );
};


const ProductPage = () => {
    const [view, setView] = useState<'list' | 'create'>('list');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleProductAdded = () => {
        fetchProducts();
        setView('list'); // Switch back to list view after adding
    };

    const TabButton = ({
        label,
        icon,
        currentView,
        targetView,
    }: {
        label: string;
        icon: React.ReactNode;
        currentView: string;
        targetView: 'list' | 'create';
    }) => {
        const isActive = currentView === targetView;
        return (
            <button
                onClick={() => setView(targetView)}
                className={`flex items-center px-4 py-2 font-medium text-sm rounded-t-md transition-colors duration-200 ${isActive
                    ? 'border-b-2 border-primary text-primary bg-primary/5 dark:bg-primary/10'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
            >
                {icon}
                {label}
            </button>
        );
    };

    return (
        <DashboardLayout title="Inventory">
            <div className="bg-card dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
                <div className="border-b dark:border-gray-700 mb-6">
                    <nav className="flex space-x-2 -mb-px">
                        <TabButton label="Product List" icon={icons.list} currentView={view} targetView="list" />
                        <TabButton label="Create Product" icon={icons.add} currentView={view} targetView="create" />
                    </nav>
                </div>
                {loading ? (
                    <div className="text-center py-8 text-text-secondary dark:text-gray-400">Loading Products...</div>
                ) : view === 'list' ? (
                    <ProductList products={products} onProductDeleted={fetchProducts} />
                ) : (
                    <CreateProductForm onProductAdded={handleProductAdded} />
                )}
            </div>
        </DashboardLayout>
    );
};

export default ProductPage;
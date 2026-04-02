import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Add New Product</h1>
        <p className="text-gray-400 text-sm mt-1">Fill in the details below.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <ProductForm />
      </div>
    </div>
  )
}

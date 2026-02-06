import { useForm } from 'react-hook-form'
import type { FormSchema, FormData } from '../types/form'

interface DynamicFormProps {
    schema: FormSchema
    onSubmit: (data: FormData) => void
}

export default function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Title */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white text-right">
                    {schema.title}
                </h2>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
                {schema.fields.map((field) => (
                    <div key={field.id} className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
                        <label htmlFor={field.id} className="block text-right mb-3">
                            <span className="text-base font-semibold text-gray-800">
                                {field.label}
                                {field.required && <span className="text-red-500 mr-2">*</span>}
                            </span>
                        </label>

                        {field.type === 'select' ? (
                            <select
                                id={field.id}
                                {...register(field.id, { required: field.required })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-right bg-gray-50 hover:bg-white"
                            >
                                <option value="">اختر...</option>
                                {field.options?.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : field.type === 'checkbox' ? (
                            <div className="flex items-center justify-end">
                                <input
                                    id={field.id}
                                    type="checkbox"
                                    {...register(field.id)}
                                    className="w-6 h-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                            </div>
                        ) : (
                            <input
                                id={field.id}
                                type={field.type}
                                placeholder={field.placeholder}
                                {...register(field.id, { required: field.required })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-right bg-gray-50 hover:bg-white"
                            />
                        )}

                        {errors[field.id] && (
                            <p className="text-red-500 text-sm mt-2 text-right flex items-center justify-end gap-2">
                                <span>هذا الحقل مطلوب</span>
                                <span>⚠️</span>
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
            >
                إنشاء PDF ✨
            </button>
        </form>
    )
}

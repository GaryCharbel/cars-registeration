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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Form Title */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl shadow-blue-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                <h2 className="text-3xl font-black text-white text-right relative z-10">
                    {schema.title}
                </h2>
                <p className="text-blue-100 text-right mt-2 font-medium relative z-10">يرجى ملء كافة البيانات المطلوبة بدقة</p>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {schema.fields.map((field) => (
                    <div
                        key={field.id}
                        className={`group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 ${field.type === 'checkbox' ? 'flex items-center justify-between flex-row-reverse' : ''
                            }`}
                    >
                        <label
                            htmlFor={field.id}
                            className={`block text-right ${field.type === 'checkbox' ? 'mb-0 ml-4' : 'mb-3'}`}
                        >
                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                                {field.label}
                                {field.required && <span className="text-red-500 mr-1.5">*</span>}
                            </span>
                        </label>

                        <div className="relative">
                            {field.type === 'select' ? (
                                <select
                                    id={field.id}
                                    {...register(field.id, { required: field.required })}
                                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-right bg-gray-50/50 hover:bg-white font-medium"
                                >
                                    <option value="">اختر من القائمة...</option>
                                    {field.options?.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === 'checkbox' ? (
                                <div className="flex items-center">
                                    <input
                                        id={field.id}
                                        type="checkbox"
                                        {...register(field.id)}
                                        className="w-6 h-6 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500/10 cursor-pointer transition-all"
                                    />
                                </div>
                            ) : field.type === 'file' ? (
                                <div className="relative group/file">
                                    <input
                                        id={field.id}
                                        type="file"
                                        accept="image/*"
                                        {...register(field.id, { required: field.required })}
                                        className="hidden"
                                        onChange={(e) => {
                                            const fileName = e.target.files?.[0]?.name;
                                            const label = document.getElementById(`${field.id}-label`);
                                            if (label && fileName) label.innerText = fileName;
                                        }}
                                    />
                                    <label
                                        htmlFor={field.id}
                                        className="flex items-center justify-center gap-3 w-full px-5 py-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 group-hover/file:shadow-inner"
                                    >
                                        <span className="text-2xl">📸</span>
                                        <span id={`${field.id}-label`} className="text-gray-500 font-bold">إضغط لرفع الصورة الشخصية</span>
                                    </label>
                                </div>
                            ) : (
                                <input
                                    id={field.id}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    {...register(field.id, { required: field.required })}
                                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-right bg-gray-50/50 hover:bg-white font-medium placeholder:text-gray-300"
                                />
                            )}
                        </div>

                        {errors[field.id] && (
                            <p className="text-red-500 text-xs mt-2 text-right font-bold flex items-center justify-end gap-1.5">
                                <span>هذا الحقل مطلوب للتواصل</span>
                                <span>⚠️</span>
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
                <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-1 text-xl flex items-center justify-center gap-3"
                >
                    <span>إنشاء نموذج PDF</span>
                    <span className="text-2xl">✨</span>
                </button>
            </div>
        </form>
    )
}

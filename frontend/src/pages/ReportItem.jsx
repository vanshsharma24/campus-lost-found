import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ReportItem = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        type: 'LOST',
        location: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            if (image) data.append('image', image);

            await api.post('/items', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Item posted successfully');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post item');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="font-display text-4xl font-bold text-slate-900 mb-2">Report an Item</h1>
                <p className="text-slate-600">Fill in the details below to post your lost or found item</p>
            </div>

            <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Item Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: 'LOST', label: 'I Lost an Item', color: 'rose' },
                            { value: 'FOUND', label: 'I Found an Item', color: 'emerald' }
                        ].map((opt) => (
                            <label
                                key={opt.value}
                                className={`relative flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    formData.type === opt.value
                                        ? opt.color === 'rose'
                                            ? 'border-rose-500 bg-rose-50'
                                            : 'border-emerald-500 bg-emerald-50'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    value={opt.value}
                                    checked={formData.type === opt.value}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    formData.type === opt.value
                                        ? opt.color === 'rose'
                                            ? 'border-rose-500 bg-rose-500'
                                            : 'border-emerald-500 bg-emerald-500'
                                        : 'border-slate-300'
                                }`}>
                                    {formData.type === opt.value && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <span className={`font-semibold ${
                                    formData.type === opt.value
                                        ? opt.color === 'rose' ? 'text-rose-700' : 'text-emerald-700'
                                        : 'text-slate-700'
                                }`}>
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Item Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g. Black leather wallet"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="input-field resize-none"
                        placeholder="Describe the item in detail — color, brand, distinctive features, contents..."
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g. Central Library, 2nd floor"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Photo <span className="text-slate-400 font-normal">(optional but recommended)</span>
                    </label>
                    {imagePreview ? (
                        <div className="relative rounded-xl overflow-hidden border-2 border-slate-200">
                            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                            <button
                                type="button"
                                onClick={() => { setImage(null); setImagePreview(null); }}
                                className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-lg shadow-md"
                            >
                                <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <label className="block cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-brand-400 hover:bg-brand-50/50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="sr-only"
                            />
                            <svg className="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-slate-600">
                                <span className="font-semibold text-brand-600">Click to upload</span> or drag & drop
                            </p>
                            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP up to 5MB</p>
                        </label>
                    )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-secondary flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Posting...' : 'Post Item'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportItem;

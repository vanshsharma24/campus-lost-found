import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EditItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        location: '',
        date: '',
        status: 'OPEN'
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        loadCategories();
        loadItem();
    }, [id]);

    const loadCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadItem = async () => {
        try {
            const res = await api.get(`/items/${id}`);
            setFormData({
                title: res.data.title,
                description: res.data.description,
                category_id: res.data.category_id || '',
                location: res.data.location,
                date: res.data.date.split('T')[0],
                status: res.data.status
            });
        } catch (err) {
            toast.error('Failed to load item');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            if (image) data.append('image', image);

            await api.put(`/items/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Item updated');
            navigate(`/items/${id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="font-display text-4xl font-bold text-slate-900 mb-2">Edit Item</h1>
                <p className="text-slate-600">Update the details of your posted item</p>
            </div>

            <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="input-field"
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
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="OPEN">Open</option>
                        <option value="CLAIMED">Claimed</option>
                        <option value="RETURNED">Returned</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Change Image <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="input-field"
                    />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => navigate(`/items/${id}`)}
                        className="btn-secondary flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1 py-3 disabled:opacity-60"
                    >
                        {loading ? 'Updating...' : 'Update Item'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditItem;

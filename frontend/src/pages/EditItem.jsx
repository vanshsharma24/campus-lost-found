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
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Item</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Title</label>
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
                        <label className="block text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="input-field h-24"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Category</label>
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
                        <label className="block text-gray-700 mb-1">Location</label>
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
                        <label className="block text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Status</label>
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
                        <label className="block text-gray-700 mb-1">Change Image (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="input-field"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded font-medium disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Item'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/items/${id}`)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2.5 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditItem;

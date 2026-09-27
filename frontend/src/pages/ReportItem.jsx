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
        date: ''
    });
    const [image, setImage] = useState(null);

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
        setImage(e.target.files[0]);
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
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Report an Item</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="LOST"
                                    checked={formData.type === 'LOST'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                I Lost an Item
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="FOUND"
                                    checked={formData.type === 'FOUND'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                I Found an Item
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Item Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="e.g. Black wallet"
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
                            placeholder="Describe the item in detail..."
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
                            placeholder="e.g. Library, Block A"
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
                        <label className="block text-gray-700 mb-1">Image (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="input-field"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded font-medium disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : 'Post Item'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportItem;

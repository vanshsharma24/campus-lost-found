import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setFormData({
                name: res.data.name,
                phone: res.data.phone || ''
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/profile', formData);
            updateUser(res.data.user);
            toast.success('Profile updated');
        } catch (err) {
            toast.error('Update failed');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="input-field bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded font-medium disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;

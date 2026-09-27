import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showClaimForm, setShowClaimForm] = useState(false);
    const [claimDesc, setClaimDesc] = useState('');

    useEffect(() => {
        loadItem();
    }, [id]);

    const loadItem = async () => {
        try {
            const res = await api.get(`/items/${id}`);
            setItem(res.data);
        } catch (err) {
            toast.error('Item not found');
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await api.delete(`/items/${id}`);
            toast.success('Item deleted');
            navigate('/items');
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleMarkReturned = async () => {
        try {
            await api.patch(`/items/${id}/return`);
            toast.success('Marked as returned');
            loadItem();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        if (!claimDesc.trim()) {
            toast.error('Please provide claim details');
            return;
        }

        try {
            await api.post('/claims', { item_id: id, description: claimDesc });
            toast.success('Claim submitted');
            setShowClaimForm(false);
            setClaimDesc('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit claim');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!item) return <div className="text-center py-20">Item not found</div>;

    const imageUrl = getImageUrl(item.image) || 'https://via.placeholder.com/600x400?text=No+Image';

    const isOwner = user && user.id === item.user_id;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link to="/items" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Items
            </Link>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={imageUrl} alt={item.title} className="w-full h-80 object-cover" />

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">{item.title}</h1>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded text-sm font-medium ${
                                item.type === 'LOST' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {item.type}
                            </span>
                            <span className={`px-3 py-1 rounded text-sm font-medium ${
                                item.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' :
                                item.status === 'CLAIMED' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-200 text-gray-700'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-700 mb-6">{item.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-6 border-t pt-4">
                        <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-medium">{item.category_name || 'Uncategorized'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">{item.location}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Posted By</p>
                            <p className="font-medium">{item.user_name}</p>
                        </div>
                    </div>

                    {user && !isOwner && (
                        <div className="border-t pt-4 mb-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
                            <p className="text-gray-600">Email: {item.user_email}</p>
                            {item.user_phone && <p className="text-gray-600">Phone: {item.user_phone}</p>}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3 border-t pt-4">
                        {isOwner ? (
                            <>
                                <button
                                    onClick={() => navigate(`/edit/${id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Edit
                                </button>
                                {item.status !== 'RETURNED' && (
                                    <button
                                        onClick={handleMarkReturned}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                    >
                                        Mark as Returned
                                    </button>
                                )}
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            user && item.status === 'OPEN' && (
                                <button
                                    onClick={() => setShowClaimForm(!showClaimForm)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Submit Claim
                                </button>
                            )
                        )}
                        {!user && (
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Login to submit a claim
                            </Link>
                        )}
                    </div>

                    {showClaimForm && (
                        <form onSubmit={handleClaimSubmit} className="mt-4 bg-gray-50 p-4 rounded">
                            <h4 className="font-semibold mb-2">Provide details to verify ownership</h4>
                            <textarea
                                value={claimDesc}
                                onChange={(e) => setClaimDesc(e.target.value)}
                                placeholder="Describe unique features, when you lost it, or any proof of ownership..."
                                className="input-field h-24"
                                required
                            />
                            <div className="flex gap-2 mt-3">
                                <button type="submit" className="btn-primary">Submit</button>
                                <button
                                    type="button"
                                    onClick={() => setShowClaimForm(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;

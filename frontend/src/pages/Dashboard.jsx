import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import ItemCard from '../components/ItemCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('lost');
    const [items, setItems] = useState([]);
    const [claims, setClaims] = useState([]);
    const [receivedClaims, setReceivedClaims] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'lost') {
                const res = await api.get('/items/my/items?type=LOST');
                setItems(res.data);
            } else if (activeTab === 'found') {
                const res = await api.get('/items/my/items?type=FOUND');
                setItems(res.data);
            } else if (activeTab === 'returned') {
                const res = await api.get('/items/my/items');
                setItems(res.data.filter((i) => i.status === 'RETURNED'));
            } else if (activeTab === 'my-claims') {
                const res = await api.get('/claims/my');
                setClaims(res.data);
            } else if (activeTab === 'received') {
                const res = await api.get('/claims/received');
                setReceivedClaims(res.data);
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const handleClaimAction = async (claimId, status) => {
        try {
            await api.patch(`/claims/${claimId}/status`, { status });
            toast.success(`Claim ${status.toLowerCase()}`);
            loadData();
        } catch (err) {
            toast.error('Failed to update claim');
        }
    };

    const tabs = [
        { key: 'lost', label: 'My Lost Items' },
        { key: 'found', label: 'My Found Items' },
        { key: 'my-claims', label: 'My Claims' },
        { key: 'received', label: 'Claims Received' },
        { key: 'returned', label: 'Returned Items' }
    ];

    const statusColor = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        APPROVED: 'bg-green-100 text-green-700',
        REJECTED: 'bg-red-100 text-red-700'
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="bg-white rounded-lg shadow mb-6">
                <div className="flex flex-wrap border-b">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-3 font-medium ${
                                activeTab === tab.key
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : activeTab === 'my-claims' ? (
                <div className="space-y-4">
                    {claims.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No claims submitted yet</div>
                    ) : (
                        claims.map((claim) => (
                            <div key={claim.id} className="bg-white p-4 rounded-lg shadow flex gap-4">
                                {claim.item_image && (
                                    <img
                                        src={getImageUrl(claim.item_image)}
                                        alt={claim.item_title}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                )}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-lg">{claim.item_title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded ${statusColor[claim.status]}`}>
                                            {claim.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{claim.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Submitted on {new Date(claim.created_at).toLocaleDateString()}
                                    </p>
                                    <Link
                                        to={`/items/${claim.item_id}`}
                                        className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                                    >
                                        View Item
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : activeTab === 'received' ? (
                <div className="space-y-4">
                    {receivedClaims.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No claims received yet</div>
                    ) : (
                        receivedClaims.map((claim) => (
                            <div key={claim.id} className="bg-white p-4 rounded-lg shadow">
                                <div className="flex gap-4">
                                    {claim.item_image && (
                                        <img
                                            src={getImageUrl(claim.item_image)}
                                            alt={claim.item_title}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-lg">{claim.item_title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded ${statusColor[claim.status]}`}>
                                                {claim.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <span className="font-medium">Claimed by:</span> {claim.claimer_name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Contact:</span> {claim.claimer_email}
                                            {claim.claimer_phone && ` | ${claim.claimer_phone}`}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                                            {claim.description}
                                        </p>
                                        {claim.status === 'PENDING' && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => handleClaimAction(claim.id, 'APPROVED')}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleClaimAction(claim.id, 'REJECTED')}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No items found.{' '}
                    <Link to="/report" className="text-blue-600 hover:underline">
                        Report one now
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;

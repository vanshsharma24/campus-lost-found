import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
    const imageUrl = item.image
        ? `http://localhost:5000/uploads/${item.image}`
        : 'https://via.placeholder.com/300x200?text=No+Image';

    const typeColor = item.type === 'LOST' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
    const statusColor = {
        OPEN: 'bg-yellow-100 text-yellow-700',
        CLAIMED: 'bg-blue-100 text-blue-700',
        RETURNED: 'bg-gray-200 text-gray-700'
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <img src={imageUrl} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${typeColor}`}>{item.type}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="text-sm text-gray-500 space-y-1">
                    <p><span className="font-medium">Location:</span> {item.location}</p>
                    <p><span className="font-medium">Date:</span> {new Date(item.date).toLocaleDateString()}</p>
                    {item.category_name && (
                        <p><span className="font-medium">Category:</span> {item.category_name}</p>
                    )}
                </div>
                <div className="mt-3 flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded ${statusColor[item.status]}`}>
                        {item.status}
                    </span>
                    <Link
                        to={`/items/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;

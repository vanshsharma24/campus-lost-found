import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/api';

const ItemCard = ({ item }) => {
    const imageUrl = getImageUrl(item.image) || 'https://via.placeholder.com/500x400?text=No+Image';

    const typeStyles = item.type === 'LOST'
        ? 'bg-rose-100 text-rose-700 border border-rose-200'
        : 'bg-emerald-100 text-emerald-700 border border-emerald-200';

    const statusStyles = {
        OPEN: 'bg-amber-100 text-amber-700 border border-amber-200',
        CLAIMED: 'bg-blue-100 text-blue-700 border border-blue-200',
        RETURNED: 'bg-slate-100 text-slate-600 border border-slate-200'
    };

    return (
        <Link to={`/items/${item.id}`} className="group block">
            <div className="card overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                        <span className={`badge ${typeStyles}`}>
                            {item.type}
                        </span>
                    </div>
                    <div className="absolute top-3 right-3">
                        <span className={`badge ${statusStyles[item.status]}`}>
                            {item.status}
                        </span>
                    </div>
                </div>

                <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                        {item.description}
                    </p>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        {item.category_name && (
                            <div className="flex items-center gap-2 text-slate-600">
                                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span>{item.category_name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ItemCard;

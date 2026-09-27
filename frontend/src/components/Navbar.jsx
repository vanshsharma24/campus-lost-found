import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    Campus Lost & Found
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                    <Link to="/items" className="text-gray-700 hover:text-blue-600">Browse Items</Link>

                    {user ? (
                        <>
                            <Link to="/report" className="text-gray-700 hover:text-blue-600">Report Item</Link>
                            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
                            <div className="flex items-center gap-3">
                                <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                                    {user.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

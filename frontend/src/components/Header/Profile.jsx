import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { motion } from 'framer-motion'
import { MapPin, ShoppingBag, Mail, MessageCircle } from 'lucide-react'

const Profile = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const username = searchParams.get('username')
    const curuser = useSelector((state) => state.login.user) || {username: '', email: '', avatar: '#'}
    const isLogin =  useSelector((state) => state.login.isLogin)
    const [user, setUser] = useState({
        username: 'none',
        avatar: '',
        isFarmer: false,
        products: [],
        email: 'none'
    })

    useEffect(() => {
        if (!isLogin){
            navigate('/')
        }
        axios.post(`${import.meta.env.VITE_BACKEND_API}/user/searchuser`, { username })
            .then((res) => {
                if (res.status < 400) {
                    if (!res.data.user) return
                    setUser(res.data.user)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [username])

    const handleSendMessage = () => {
        console.log(`Sending message to ${user.username}`)
        navigate(`/chat?with=${encodeURIComponent(user.username)}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="relative h-48 bg-gradient-to-r from-green-600 to-green-700">
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                            />
                        </div>
                    </div>
                    <div className="pt-20 pb-6 px-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                        <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                        </div>
                        
                        {curuser.username !== user.username && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSendMessage}
                                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full
                                         hover:bg-green-700 transition-colors duration-200
                                         flex items-center justify-center gap-2 mx-auto"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Send Message
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* About Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-xl"
                >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Welcome to my profile! I'm passionate about sustainable farming and providing quality products.
                    </p>
                </motion.div>

                {/* Products Section */}
                {user.isFarmer && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-2xl shadow-xl"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <ShoppingBag className="w-5 h-5 text-green-600" />
                            <h3 className="text-xl font-semibold text-gray-900">Product Listings</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.products.length > 0 ? (
                                user.products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        whileHover={{ y: -4 }}
                                        className="bg-gray-50 rounded-xl overflow-hidden shadow-md 
                                                 hover:shadow-xl transition-all duration-300"
                                    >
                                        <img
                                            src={product.photo}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h4 className="font-semibold text-lg text-gray-900 mb-2">
                                                {product.name}
                                            </h4>
                                            <p className="text-green-600 font-bold mb-2">
                                                ₹{product.price.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <MapPin className="w-4 h-4" />
                                                <span>{product.category} • {product.region}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 text-gray-500">
                                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-40" />
                                    <p>No products listed yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Profile

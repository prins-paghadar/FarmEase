import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, MapPin } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/product/searchproduct`, 
          { search: id }, 
          { withCredentials: true }
        );

        if (res.status < 400 && res.data.length > 0) {
          setProduct(res.data[0]);

          // Fetch cart quantity after product data is set
          fetchCartQuantity(res.data[0]._id);
        } else {
          console.error('Bad request while searching for the product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchCartQuantity = async (productId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/product/getcartquantity/${productId}`,
        { withCredentials: true }
      );
      setCartQuantity(response.data.quantity || 0);
    } catch (error) {
      console.error('Error fetching cart quantity:', error);
    }
  };

  const addToCart = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/product/addtocart`,
        { productId: product._id },
        { withCredentials: true }
      );

      // Update cart quantity locally
      setCartQuantity((prevQuantity) => prevQuantity + 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-green-800 hover:text-green-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[400px]">
              <img
                src={product.photo}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-green-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">{product.region}</span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-green-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Cart Quantity Display */}
              {cartQuantity > 0 && (
                <div className="text-gray-700 mb-4">
                  <span className="font-semibold">In Cart: </span>
                  {cartQuantity} item{cartQuantity > 1 ? 's' : ''}
                </div>
              )}

              <button
                onClick={addToCart}
                className="w-full bg-green-900 text-white py-3 rounded-xl hover:bg-green-950 
                         transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartQuantity > 0 ? 'Add More' : 'Add to Cart'}
              </button>

              {/* Farmer Info */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <img
                    src={product.owner.avatar}
                    alt={product.owner.username}
                    className="w-12 h-12 rounded-full border-2 border-green-900"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.owner.username}</h3>
                    <p className="text-sm text-gray-500">Verified Farmer</p>
                  </div>
                  <button
                    onClick={() => navigate(`/profile?username=${product.owner.username}`)}
                    className="ml-auto bg-green-100 text-green-900 px-4 py-2 rounded-full 
                             text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

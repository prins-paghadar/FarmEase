import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductDetail from "./ProductDetail";

const ProductBox = ({ product }) => {

  const navigate = useNavigate()

  const onProfile = (e) => {
    navigate(`/profile?username=${encodeURIComponent(product.owner.username)}`)
  }

  const cartHandler = (e) => {
    let self = e.target
    self.classList.add('scale-125')
    setTimeout(() => {
      self.classList.remove('scale-125')
    }, 40)
    axios.post(`${import.meta.env.VITE_BACKEND_API}/product/addtocart`, {productId: product._id}, {
      withCredentials: true
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const hendlProduct = (event) => {
    // console.log(event.currentTarget); // Logs the outermost div
    // console.log(product); 
    <ProductDetail product={product} />
    navigate(`/product/${product.name }`);
    // event.stopPropagation();
  // Navigate to product detail page using product ID
  }

  return (
    <div 
    onClick={hendlProduct}
    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform  overflow-hidden w-72 h-fit">
      <div className="relative group">
        <img
          src={product.photo}
          alt={product.name}
          className="w-full h-40 object-cover transition-transform duration-300 "
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-green-900/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
          {product.category}
        </span>
      </div>

      {/* Product Details Container - Reduced padding */}
      <div className="p-4">
        {/* Product Info - Reduced margins */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium text-blue-600">{product.region}</span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-green-950">₹{product.price}</span>
            {/* <span className="text-sm text-gray-500 ml-1">/kg</span> */}
          </div>
          <button 
            onClick={cartHandler}
            className="bg-green-900 text-white px-4 py-1.5 rounded-full hover:bg-green-950 active:scale-95 transition-all duration-200 flex items-center gap-1.5 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add
          </button>
        </div>

        <div 
          onClick={onProfile}
          className="flex items-center pt-3 border-t border-gray-100 cursor-pointer group/owner"
        >
          <div className="relative">
            <img
              src={product.owner.avatar}
              alt={product.owner.username}
              className="w-8 h-8 rounded-full border-2 border-green-900 group-hover/owner:border-green-950 transition-colors"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-900 rounded-full flex items-center justify-center text-white text-[10px] font-medium">
              F
            </span>
          </div>
          <div className="ml-2">
            <span className="text-sm font-semibold text-gray-700 group-hover/owner:text-green-950 transition-colors">
              {product.owner.username}
            </span>
            <p className="text-xs text-gray-500">Farmer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBox;

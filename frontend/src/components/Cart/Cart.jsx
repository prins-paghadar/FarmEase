import { useState, useEffect } from "react";
import axios from 'axios'
import {useSelector} from 'react-redux'
import {Loader2} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react';

const Cart = () => {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const isLogin = useSelector((state) => state.login.isLogin)
  const [loading, setLoading] = useState(true)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    setTotal(cart.reduce((acc, cur) => acc + cur.product.price*cur.quantity, 0))
  }, [cart])

  useEffect(() => {
    setLoading(true)
    axios.post(`${import.meta.env.VITE_BACKEND_API}/product/getcart`,{}, {
        withCredentials: true
    })
    .then((res) => {
        setCart(res.data.cart)
        setLoading(false) 
    })
    .catch((err) => {
        console.log(err.message)
        setLoading(false)
    })
  }, []);

  const incrementQuantity = (id) => {
    setLoading(true)
    axios.post(`${import.meta.env.VITE_BACKEND_API}/product/addtocart`, {productId:id}, {
        withCredentials: true
    })
    .then((res) => {
        setCart((cart) => cart.map((item) => (item.product._id===id) ? ({...item, quantity:item.quantity+1}) : item))
        setLoading(false)
    })
    .catch((err) => {
        console.log(err.message)
        setLoading(false)
    })
  };

  // Decrease quantity
  const decrementQuantity = (id) => {
    setLoading(true)
    axios.post(`${import.meta.env.VITE_BACKEND_API}/product/removefromcart`, {productId:id}, {
        withCredentials: true
    })
    .then((res) => {
        setCart((cart) => cart.map((item) => item.product._id===id ? ({...item, quantity:item.quantity-1}) : item).filter((item) => item.quantity>0))
        setLoading(false)
    })
    .catch((err) => {
        console.log(err.message)
        setLoading(false)
    })
  };

  // Remove item from cart
  const removeItem = (id) => {
    setLoading(true)
    axios.post(`${import.meta.env.VITE_BACKEND_API}/product/deletefromcart`, {productId:id}, {
        withCredentials: true
    })
    .then((res) => {
        setCart((cart) => cart.map((item) => item.product._id===id ? {...item, quantity:-1} : item).filter((item) => item.quantity!==-1))
        setLoading(false)
    })
    .catch((err) => {
        console.log(err)
        setLoading(false)
    })
  };

  const buyHandler = async (e) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/order/create`,
        { cart, total },
        { withCredentials: true }
      );
      
      // Create simple order details for QR code
      const orderDate = new Date().toLocaleString();
      const orderInfo = {
        items: response.data.data.products.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: response.data.data.total,
        date: orderDate
      };
      
      const formattedOrderData = {
        qrText: JSON.stringify(orderInfo),
        items: response.data.data.products.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        })),
        total: response.data.data.total,
        orderDate
      };
      
      setOrderData(formattedOrderData);
      setOrderPlaced(true);
      setCart([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("order-qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `order-${orderData.orderDate.split('T')[0]}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">
      {loading && (
        <>
          <div className="z-[100] opacity-10 top-0 left-0 min-h-[100vh] min-w-[100vw] fixed bg-black" />
          <Loader2 className="z-[100] opacity top-[45vh] left-[45vw] min-h-[10vh] min-w-[10vw] fixed flex justify-center w-10 opacity-100 h-10 animate-spin text-gray-800 " />
        </>
      )}

      {orderPlaced ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
          <div className="mb-6">
            <QRCodeSVG
              id="order-qr-code"
              value={JSON.stringify(orderData, null, 2)}
              size={512}
              level="M"
              className="mx-auto mb-4"
              includeMargin={true}
            />
            <button
              onClick={downloadQRCode}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Download QR Code
            </button>
          </div>
          <div className="text-left bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Order Details:</h3>
            <p className="text-gray-600 mb-2">Order Number: {orderData?.orderNumber}</p>
            {orderData?.items.map((item, index) => (
              <div key={index} className="mb-2">
                <p>{item.name} x {item.quantity} - ₹{item.price} each</p>
                <p className="text-sm text-gray-500 ml-4">Subtotal: ₹{item.subtotal}</p>
              </div>
            ))}
            <p className="font-bold mt-4">Total: ₹{orderData?.total}</p>
            <p className="text-gray-600 mt-2">Order Date: {orderData?.orderDate}</p>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            
            <>
              {cart.map(({product, quantity}) => (
                <div key={product._id} className="flex items-center gap-4 border-b pb-4 mb-4">
                  <img src={product.photo} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-500">Price: ₹{product.price}</p>
                    <p className="text-gray-500">{product.category} - {product.region}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => decrementQuantity(product._id)} 
                        className="bg-gray-300 px-2 py-1 rounded"
                      > - </button>

                      <span>{quantity}</span>

                      <button 
                        onClick={() => incrementQuantity(product._id)} 
                        className="bg-gray-300 px-2 py-1 rounded"
                      > + </button>
                    </div>

                    <button 
                      onClick={() => removeItem(product._id)} 
                      className="text-red-500 mt-2"
                    >Remove</button>
                  </div>
                </div>
              ))}

              <div className="text-right font-bold text-lg">
                Total: ₹{total}
              </div>

              <button onClick={buyHandler} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">
                Proceed to Buy
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cart
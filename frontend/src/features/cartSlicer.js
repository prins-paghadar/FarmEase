import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching cart data
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/product/getcart`, {}, {
    withCredentials: true
  });
  return response.data.cart;
});

// Async thunk for adding an item to the cart
export const addToCart = createAsyncThunk("cart/addToCart", async (productId) => {
  await axios.post(`${import.meta.env.VITE_BACKEND_API}/product/addtocart`, { productId }, {
    withCredentials: true
  });
  return productId;
});

// Async thunk for removing an item from the cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (productId) => {
  await axios.post(`${import.meta.env.VITE_BACKEND_API}/product/removefromcart`, { productId }, {
    withCredentials: true
  });
  return productId;
});

// Async thunk for deleting an item from the cart
export const deleteFromCart = createAsyncThunk("cart/deleteFromCart", async (productId) => {
  await axios.post(`${import.meta.env.VITE_BACKEND_API}/product/deletefromcart`, { productId }, {
    withCredentials: true
  });
  return productId;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    loading: false,
  },
  reducers: {
    calculateTotal: (state) => {
      state.total = state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.total = state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.product._id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        );
        state.total = state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items
          .map((item) => (item.product._id === action.payload ? { ...item, quantity: item.quantity - 1 } : item))
          .filter((item) => item.quantity > 0);
        state.total = state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.product._id !== action.payload);
        state.total = state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      });
  },
});

export const { calculateTotal , total,  } = cartSlice.actions;
export default cartSlice.reducer;

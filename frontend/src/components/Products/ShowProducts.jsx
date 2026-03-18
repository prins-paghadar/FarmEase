import ProductBox from './ProductBox'
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios, { all } from 'axios'
import { Loader2 , Filter } from 'lucide-react'

const ShowProducts = () => {
    const categories = ['All', 'Fruits', 'Vegetables', 'Dairy Products', 'Farm Core', 'Dryfruits']
    const [searchParams, setSearchParams] = useSearchParams();
    const [searched, setSearched] = useState(searchParams.get('search'))
    const [category, setCategory] = useState(searchParams.get('category'))
    const [region, setRegion] = useState(searchParams.get('region'))
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setSearched(searchParams.get('search'))
        setCategory(searchParams.get('category'))
        setRegion(searchParams.get('region'))
    }, [searchParams])

    const onCatClick = (e) => {
        let cat = e.target.innerHTML
        // setSearched('')
        // setCategory(cat)

        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams);
            newParams.set('category', cat);
            newParams.set('region', "All");
            newParams.delete('search'); 
            return newParams;
        });
    }

    useEffect(() => {
        console.log(searched, searchParams)
        setLoading(true)
        if (searched){
            axios.post(`${import.meta.env.VITE_BACKEND_API}/product/searchproduct`, {search: searched}, {
                withCredentials: true
            })
            .then((res) => {
                if (res.status < 400){
                    setProducts(res.data)
                }
                else{
                    console.log('bad request while searching product')
                }
                setLoading(false)
            })
            .catch((err) => {
                console.log(err.message)
                setLoading(false)
            })
        }
        else{
            axios.post(`${import.meta.env.VITE_BACKEND_API}/product/filterproduct`, {category, region}, {
                withCredentials: true
            })
            .then((res) => {
                if (res.status < 400){
                    setProducts(res.data)
                }
                else{
                    console.log('bad request while searching product')
                }
                setLoading(false)
            })
            .catch((err) => {
                console.log(err.message)
                setLoading(false)
            })
        }
    }, [searched, category, region])

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-green-50 to-green-100">
            {/* Loading Overlay */}
            {loading && (
                <>
                    <div className="z-[100] fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    <div className="z-[100] fixed inset-0 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
                    </div>
                </>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">Our Products</h1>
                    <p className="text-gray-600">Fresh from the farm to your table</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                    {/* Sidebar*/}
                    <div className="lg:w-64 lg:shrink-0">
                        <div className="bg-white/80 backdrop-blur-sm p-4 lg:p-6 rounded-2xl shadow-lg lg:sticky lg:top-24">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-green-700" />
                                    <h2 className="text-xl font-semibold text-green-800">Categories</h2>
                                </div>
                            </div>
                            <div className="flex lg:block overflow-x-auto pb-2 lg:pb-0 gap-2 lg:space-y-2">
                                {categories.map((cat, index) => (
                                    <button
                                        key={index}
                                        onClick={onCatClick}
                                        className={`whitespace-nowrap px-4 py-2 rounded-lg transition-all duration-200 
                                            ${category === cat 
                                                ? 'bg-green-100 text-green-700 font-medium'
                                                : 'hover:bg-green-50 text-gray-600'
                                            } ${index === 0 ? 'lg:w-full' : 'lg:w-full'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="flex-1 w-full">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 place-items-center">
                                {products.map((product, index) => (
                                    <div 
                                        key={index}
                                        className="w-[280px] h-[380px] bg-white rounded-xl overflow-hidden shadow-md 
                                                 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <ProductBox 
                                            product={product}
                                            className="h-full w-full flex flex-col"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[400px] 
                                          bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-8">
                                <svg
                                    className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 text-center">No Products Found</h3>
                                <p className="text-gray-500 text-center text-sm sm:text-base">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowProducts
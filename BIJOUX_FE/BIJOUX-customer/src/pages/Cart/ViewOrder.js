import React, { useEffect, useState } from "react";
import OrderCard from "../../components/Cart/Orders/orderCard";
import Swal from 'sweetalert2';
import { cancel_order, cancel_payment, get_order_list_customer } from "../../api/main/orders/Order_api";
import { instantAlertMaker, paymentAlertMaker } from "../../api/instance/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";



function useQuery() {
    return new URLSearchParams(useLocation().search);
}
function removeQueryParam(param) {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState({}, '', url);
}

export default function ViewOrder() {
    const query = useQuery();
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState([]);
    const [customizationOrderList, setCustomizationOrderList] = useState([]);
    const [templateOrderList, setTemplateOrderList] = useState([]);
    const [deliveryOrderList, setDeliveryOrderList] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDataChange = async () => {
        setLoading(true);
        const order_list = await get_order_list_customer(null, 'get order list', true);
        const tempCustomizationOrderList = order_list.data.customize_order_list.filter(order => order.order_status.id !== 5 && order.order_status.id !== 6);
        const tempTemplateOrderList = order_list.data.template_order_list.filter(order => order.order_status.id !== 5 && order.order_status.id !== 6);
        const tempDeliveryOrderList = [
            ...order_list.data.customize_order_list.filter(order => order.order_status.id === 5 || order.order_status.id === 6),
            ...order_list.data.template_order_list.filter(order => order.order_status.id === 5 || order.order_status.id === 6)
        ];
        setOrderList(order_list.data);
        setCustomizationOrderList(tempCustomizationOrderList);
        setTemplateOrderList(tempTemplateOrderList);
        setDeliveryOrderList(tempDeliveryOrderList);
        setLoading(false);
    }

    const handleCancelPayment = async (payment_id) => {
        const formData = new FormData();
        formData.append("payment_id", payment_id);
        const response = await cancel_payment(formData, 'Get order detail', true);
    }

    useEffect(() => {
        if (query.get("payment_status") == "success") {
            paymentAlertMaker(navigate, 'success', 'Payment success', 'Your payment has been successfully processed. Thank you for your purchase!')
        } else if (query.get("payment_status") == "cancel") {
            if (query.get("status") === "CANCELLED") {
                const payment_id = query.get("orderCode");
                handleCancelPayment(payment_id);
            }
            paymentAlertMaker(navigate, 'error', 'Payment failed', 'Your payment has failed. Please try again!')
        }
    }, [query])
    useEffect(() => {

        handleDataChange();
    }, []);



    const [type, setType] = useState("Customization");

    const handleCancelOrder = async (orderId) => {
        // call api to cancel order
        Swal.fire({
            title: "Are you sure you want to cancel this order?",
            text: "You won't be able to revert this! If you have any problem, please contact us at: +84 099 009",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Xử lý khi người dùng xác nhận
                const cancel = {
                    order_id: orderId,
                    note: null
                }
                const formData = new FormData();
                formData.append("cancel", JSON.stringify(cancel));
                const response = await cancel_order(formData, 'cancel order', true);
                //setOrderList(orderList.filter(order => order.id !== id)); //này là test thôi nha
                if (!response.success) {
                    instantAlertMaker("error", "Error", "The order has not been canceled. Please try again !");
                    return;
                }
                Swal.fire({
                    title: "Success",
                    text: "The order has been cancel successfully!",
                    icon: "success"
                });
                handleDataChange();
            }
        });
    }



    return (
        <div className="w-full flex flex-col items-center text-[#151542]">
            <h1 className="font-loraFont text-4xl font-semibold">
                Your Order List
            </h1>
            <div className="w-11/12 grid grid-cols-3">
                <div className="flex flex-col w-full items-center justify-center">
                    <button onClick={() => setType('Customization')}
                        className={`${type === 'Customization' ? 'text-indigo-500 font-semibold' : 'font-semibold'
                            } flex items-center`}>

                        <span>Customization</span>&nbsp;

                        <span className="inline-flex items-center rounded-full bg-gray-500 px-2 py-1 mb-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-500/10">{!loading && customizationOrderList.length}</span>
                    </button>
                    <div className={`h-1 w-full bg-gray-400 ${type === 'Customization' ? 'bg-indigo-500' : 'bg-gray-400'
                        }`}>
                    </div>
                </div>
                <div className="flex flex-col w-full items-center justify-center">
                    <button onClick={() => setType('Template')}
                        className={`${type === 'Template' ? 'text-indigo-500 font-semibold' : 'font-semibold'
                            } flex items-center`}>

                        <span>Template</span>&nbsp;

                        <span className="inline-flex items-center rounded-full bg-gray-500 px-2 py-1 mb-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-500/10">{!loading && templateOrderList.length}</span>
                    </button>
                    <div className={`h-1 w-full bg-gray-400 ${type === 'Template' ? 'bg-indigo-500' : 'bg-gray-400'
                        }`}>
                    </div>
                </div>
                <div className="flex flex-col w-full items-center justify-center">
                    <button onClick={() => setType('Delivery')}
                        className={`${type === 'Delivery' ? 'text-indigo-500 font-semibold' : 'font-semibold'
                            } flex items-center`}>
                        
                        <span>Delivery</span>&nbsp;

                        <span className="inline-flex items-center rounded-full bg-gray-500 px-2 py-1 mb-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-500/10">{!loading && deliveryOrderList.length}</span>
                    </button>
                    <div className={`h-1 w-full bg-gray-400 ${type === 'Delivery' ? 'bg-indigo-500' : 'bg-gray-400'
                        }`}>
                    </div>
                </div>
            </div>
            {loading ?
                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', padding: '100px' }}>
                    <CircularProgress color="inherit" />
                </Box>
                :
                <>
                    {customizationOrderList.length === 0 && templateOrderList.length === 0 && deliveryOrderList.length === 0 && (
                        <div className="w-full flex items-center justify-center mt-2">
                            <p className="text-2xl font-titleFont font-semibold text-green-800">Your order list currently has no orders. Please wait for future updates</p>
                        </div>
                    )
                    }
                    {customizationOrderList.length === 0 && type === 'Customization' && (
                        <div className="w-full flex items-center justify-center mt-2">
                            <p className="text-2xl font-titleFont font-semibold text-green-800">Your customize order list currently has no orders.</p>
                        </div>
                    )
                    }
                    {templateOrderList.length === 0 && type === 'Template' && (
                        <div className="w-full flex items-center justify-center mt-2">
                            <p className="text-2xl font-titleFont font-semibold text-green-800">Your template order list currently has no orders. </p>
                        </div>
                    )
                    }
                    {deliveryOrderList.length === 0 && type === 'Delivery' && (
                        <div className="w-full flex items-center justify-center mt-2">
                            <p className="text-2xl font-titleFont font-semibold text-green-800">Your delivery order list currently has no orders.</p>
                        </div>
                    )
                    }
                    {type === 'Customization' && (
                        <div className="w-full flex flex-col items-center mt-5">
                            {customizationOrderList.map(order => (
                                <OrderCard order={order} onCancel={() => handleCancelOrder(order.id)} />
                            ))}
                        </div>
                    )}
                    {type === 'Template' && (
                        <div className="w-full flex flex-col items-center mt-5">
                            {templateOrderList.map(order => (
                                <OrderCard order={order} onCancel={() => handleCancelOrder(order.id)} />
                            ))}
                        </div>
                    )}
                    {type === 'Delivery' && (
                        <div className="w-full flex flex-col items-center mt-5">
                            {deliveryOrderList.map(order => (
                                <OrderCard order={order} onCancel={() => handleCancelOrder(order.id)} handleDataChange={handleDataChange} />
                            ))}
                        </div>
                    )}
                </>


            }


        </div >
    );
}
import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardImage,
    CCardTitle,
    CCardText,
    CModal,
    CModalBody,
    CModalHeader,
    CSpinner,
    CRow,
    CCol,
    CCardHeader,
} from '@coreui/react'
import { ArrowCircleUp, CurrencyCircleDollar, Eye, MagicWand, Pencil, PlusCircle, UserCirclePlus } from "phosphor-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './style/style.css'
import { Button, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
export const Staff_Page_Context = createContext();
import Textarea from '@mui/joy/Textarea';
import AccountCard from "./Order widget/AccountCard";
import OrderDetailCard from "./Order widget/OrderDetailCard";
import NoteCard from "./Order widget/NoteCard";
import MetalCard from "./Modal_body/model/widget/MetalCard";
import DiamondCard from "./Modal_body/model/widget/DiamondCard";
import UploadSingle from "./Order widget/UploadSingle";
import OtherCard from "./Order widget/OtherCard";
import PriceCard from "./Order widget/PriceCard";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/notification/toastSlice";
import { get_account_list } from "../../api/main/accounts/Account_api";
import { getUserFromPersist } from "../../api/instance/axiosInstance";
import { get_order_detail, request_design_process } from "../../api/main/orders/Order_api";
import { get_mounting_type_list } from "../../api/main/items/Model_api";




const Order_Detail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const index = useParams();

    const [order, setOrder] = useState(null);
    const [account, setAccount] = useState(null);
    const [product, setProduct] = useState(null);
    const [mountingType, setMountingType] = useState([]);
    const [imageBase64, setImageBase64] = useState(null);

    const [loading, setLoading] = useState(true);
    //report
    const [typeId, setTypeId] = useState(null);
    const [size, setSize] = useState(null);
    const [metalList, setMetalList] = useState([]);
    const [diamondList, setDiamondList] = useState([]);
    const [note, setNote] = useState(`Designer [ID: #${getUserFromPersist().id}] Note: \n`);


    const handleSingleFileBase64 = (base64) => {
        //console.log('file nè', base64)
        setImageBase64(base64)
    }
    const handleNote = (note) => {
        //console.log('note', note)
        setNote(note);
    }
    const handleMetal = (metal_list) => {
        //console.log('metal_list', metal_list)
        setMetalList([...metal_list])
    }
    const handleDiamond = (diamond_list) => {
        //console.log('diamond_list', diamond_list)
        setDiamondList([...diamond_list])
    }
    const handleOther = (type_id, mounting_size) => {
        //console.log('mounting_type id', type_id)
        //console.log('mounting_size', mounting_size)
        setTypeId(type_id);
        setSize(mounting_size > 0 ? mounting_size : 0);
    }



    useEffect(() => {
        const setAttribute = async () => {


            const formData = new FormData();
            formData.append('order_id', index.id);
            const detail_data = await get_order_detail(formData);
            const mounting_type = await get_mounting_type_list()

            const order_detail = detail_data.data.order_detail


            //console.log('order_detail', order_detail)
            if (order_detail.design_process_status != null) {
                dispatch(setToast({ color: "danger", title: 'Order [ID: #' + order_detail.id + ']', mess: "This order is already have a design process" }))
                navigate('/orders_design_staff/table')
            }

            setOrder(order_detail)
            setAccount(order_detail.account)
            setProduct(order_detail.product)
            setMountingType(mounting_type.data)
            setTypeId(order_detail.product.mounting_type ? order_detail.product.mounting_type.id : null)
            setSize(parseFloat(order_detail.product.mounting_size))

            setLoading(false)

        }
        setAttribute();

    }, [])



    const handleReport = async () => {
        const new_design_process = {
            "order_id": order.id,
            "imageUrl": imageBase64 ? imageBase64 : null,
            "note": note !=  null ? note.trim() : '',
            "mounting_type_id": isNaN(typeId) ? null : typeId,
            "mounting_size": isNaN(size) ? null : size,
            "metal_list": metalList,
            "diamond_list": diamondList,
            "production_price": null,
            "profit_rate": null,

        }
        //console.log('new_design_process', new_design_process)
        const formData = new FormData();
        formData.append('new_design_process', JSON.stringify(new_design_process));


        let response = await request_design_process(formData, 'New Design Process');
        dispatch(setToast(response.mess))
        if (response.success) {
            //handleDataChange();
            navigate('/orders_design_staff/table')
        }
       
        

        
    }
    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    {loading ? <CButton className="w-100" color="secondary" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton> :
                        <CCard className="mb-4">
                            <CCardHeader>
                                <strong>CREATE DESIGN PROCESS FOR ORDER ID [ #{order.id} ]</strong> <small><MagicWand size={30} color="lime" weight="duotone" /></small>
                            </CCardHeader>
                            <CCardBody className="bg-light">

                                <CRow >
                                    <CCol className="d-flex flex-column " xs={12} md={7} lg={7} >

                                        <AccountCard account={account} avatarSize={130} cardHeight={'120px'} />
                                        <div className="flex-grow-1">
                                            <NoteCard handleChange={handleNote} note={note} />

                                        </div>
                                    </CCol>
                                    <CCol xs={12} md={5} lg={5} style={{ height: '450px' }}>
                                        <div className="h-50">
                                            <OrderDetailCard order={order} />
                                        </div>
                                        <div className="h-50 d-flex p-2 flex-column mt-1 rounded"  >

                                            <span className="text-dark fw-bold fs-5 text-center">Product Image</span>

                                            <UploadSingle defaultImage={product.imageUrl} disabled={false} handleSingleFileBase64={handleSingleFileBase64} />

                                        </div>
                                    </CCol>

                                </CRow>


                                <div className="d-flex flex-column align-items-center my-3">
                                    <hr style={{ height: '2px', backgroundColor: 'black', border: 'none', width: '70%' }} />
                                    <h2 className="text-dark">Product Information</h2>
                                </div>
                                <div className="my-4">
                                    <MetalCard handleChange={handleMetal} product={product} />
                                </div>
                                <div className="my-4">
                                    <DiamondCard handleChange={handleDiamond} product={product} />
                                </div>
                                <CRow>
                                    <OtherCard handleChange={handleOther} mountingType={mountingType} order={order} product={product} />
                                </CRow>
                                <div className="d-flex justify-content-center mt-5">
                                    <Button
                                        disabled={metalList.length === 0}
                                        onClick={() => handleReport()}
                                        color="success"
                                        variant="outlined"
                                        className="fw-bold d-flex align-items-center text-center">
                                        Confirm Create Design Process <MagicWand size={30} color="lime" weight="duotone" /></Button>
                                </div>

                            </CCardBody>
                        </CCard>
                    }

                </CCol>
            </CRow>
        </div>
    );

}
export default Order_Detail;

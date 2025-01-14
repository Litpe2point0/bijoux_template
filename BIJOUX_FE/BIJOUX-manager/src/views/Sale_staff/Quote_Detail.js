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
    CFormInput,
    CInputGroupText,
    CInputGroup,
    CFormSelect,
    CFormTextarea,
} from '@coreui/react'
import { get_product_list, update_product_list } from "../../api/ProductApi";
import Modal_Button from "../component_items/Modal/ModalButton"
import { ArrowCircleUp, CurrencyCircleDollar, Eye, Pencil, PlusCircle, UserCirclePlus } from "phosphor-react";
import AvatarInput from "../component_items/Avatar/Avatar";
//import useStickyHeader, { StickyText } from "../component_items/Ag-grid/useStickyHeader";
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './style/style.css'
import { Button, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
export const Staff_Page_Context = createContext();
import Textarea from '@mui/joy/Textarea';
import AccountCard from "./Quote widget/AccountCard";
import QuoteDetailCard from "./Quote widget/QuoteDetailCard";
import NoteCard from "./Quote widget/NoteCard";
import MetalCard from "./Modal_body/model/widget/MetalCard";
import DiamondCard from "./Modal_body/model/widget/DiamondCard";
import UploadSingle from "./Quote widget/UploadSingle";
import OtherCard from "./Quote widget/OtherCard";
import PriceCard from "./Quote widget/PriceCard";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/notification/toastSlice";
import { get_account_list } from "../../api/main/accounts/Account_api";
import { get_quote_detail, pricing_quote } from "../../api/main/orders/Quote_api";
import { get_mounting_type_list } from "../../api/main/items/Model_api";
import { CurrencyFormatterLowercase } from "../component_items/Ag-grid/money_formatter";



const Quote_Detail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const index = useParams();

    const [quote, setQuote] = useState(null);
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
    const [productionPrice, setProductionPrice] = useState(0);
    const [profitRate, setProfitRate] = useState(0);
    const [note, setNote] = useState(null);

    const [totalPrice, setTotalPrice] = useState(0);

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
    const handlePrice = (profit_rate, production_price) => {
        //console.log('profit rate', profit_rate)
        //console.log('production price', production_price)
        setProfitRate(profit_rate);
        setProductionPrice(production_price > 0 ? production_price : 0);
    }



    useEffect(() => {
        const setAttribute = async () => {

            const formData = new FormData();
            formData.append('quote_id', index.id);
            const detail_data = await get_quote_detail(formData);
            const quote_detail = detail_data.data.quote_detail;



            if (quote_detail.quote_status.id !== 2) {
                dispatch(setToast({ color: "danger", title: 'Quote [ID: #' + quote_detail.id + ']', mess: "This quote is not in pricing process" }))
                navigate('/quotes_sale_staff/table')
            }



            setQuote(quote_detail)
            setAccount(quote_detail.account)
            setProduct(quote_detail.product)


            const mounting_type_list = await get_mounting_type_list();
            //const quote_detail = detail_data.data.quote_detail;
            setMountingType(mounting_type_list.data)


            //setImageBase64(quote_detail.product.imageUrl)
            setTypeId(quote_detail.product.mounting_type ? quote_detail.product.mounting_type.id : null)
            setSize(quote_detail.product.mounting_size)
            setNote(quote_detail.note)

            setLoading(false)

        }
        setAttribute();

    }, [])
    useEffect(() => {
        const total = (parseFloat(productionPrice) + (metalList.reduce((total, item) => total + item.price, 0) + diamondList.reduce((total, item) => total + item.price, 0)) * (profitRate + 100) / 100).toFixed(2);
        //console.log('Total', total)
        setTotalPrice(parseFloat(total));
    }, [profitRate, productionPrice, metalList, diamondList])


    const handleReport = async () => {
        //await get_account_list()
        const priced_quote = {
            "quote_id": quote.id,
            "mounting_type_id": isNaN(typeId) ? null : typeId,
            "mounting_size": isNaN(size) ? null : size,
            "imageUrl": imageBase64 ? imageBase64 :  null ,
            "diamond_list": diamondList,
            "metal_list": metalList,
            "production_price": productionPrice,
            "profit_rate": profitRate,
            "note": note !=  null ? note.trim() : '',
            "total_price": totalPrice,

        }
        //console.log('priced_quote', priced_quote)
        const formData = new FormData();
        formData.append('priced_quote', JSON.stringify(priced_quote));


        let response = await pricing_quote(formData, 'Quote ID ' + quote.id);

        if (response.success) {
            navigate('/quotes_sale_staff/table')
        }
        dispatch(setToast(response.mess))
        // set toast
        //dispatch(setToast({ color: "success", title: 'Quote [ID: #' + quote.id + ']', mess: "Pricing successfully !" }))


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
                                <strong>PRICING FOR QUOTE ID [ #{quote.id} ]</strong> <small><CurrencyCircleDollar size={30} color="lime" weight="duotone" /></small>
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
                                            <QuoteDetailCard quote={quote} />
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
                                    <CCol xs={12} md={6} lg={6}>

                                        <OtherCard handleChange={handleOther} mountingType={mountingType} quote={quote} product={product} />

                                    </CCol>
                                    <CCol xs={12} md={6} lg={6}>

                                        <PriceCard handleChange={handlePrice} quote={quote} product={product} />


                                    </CCol>
                                    <CCol xs={12} md={12} lg={12} >
                                        <span className="text-dark fw-bold fs-3">Total Price: <CurrencyFormatterLowercase value={totalPrice} /> </span>
                                    </CCol>
                                </CRow>
                                <div className="d-flex justify-content-center mt-5">
                                    <Button
                                        disabled={metalList.length === 0 || profitRate === 0 || productionPrice == null || productionPrice === 0 || isNaN(productionPrice)}
                                        onClick={() => handleReport()}
                                        color="success"
                                        variant="outlined"
                                        className="fw-bold d-flex align-items-center text-center">
                                        Request Pricing <CurrencyCircleDollar size={30} color="lime" weight="duotone" /></Button>
                                </div>

                            </CCardBody>
                        </CCard>
                    }

                </CCol>
            </CRow>
        </div>
    );

}
export default Quote_Detail;

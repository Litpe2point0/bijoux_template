import React, { useContext, useEffect, useState, useRef } from "react";

import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CRow,
    CSpinner,
    CCard,
    CCardHeader,
    CCardBody,
    CPlaceholder
} from '@coreui/react'
import { get_account_list } from "../../../api/main/accounts/Account_api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../redux/notification/toastSlice";
import { FaUserCheck } from "react-icons/fa";
import DateTimePicker from "../../component_items/DatePicker/DateTimePicker";
import AccountCard from "../Quote widget/AccountCard";
import QuoteDetailCard from "../Quote widget/QuoteDetailCard";
import NoteCard from "../Quote widget/NoteCard";
import AssignCard from "../Quote widget/AssignCard";
import { useNavigate } from "react-router-dom";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import AvatarInput from "../../component_items/Avatar/Avatar";
import { get } from "jquery";
import MetalCard from "../../Sale_staff/Modal_body/model/widget/MetalCard";
import DiamondCard from "../../Sale_staff/Modal_body/model/widget/DiamondCard";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
import QuoteProductImage from "../Quote widget/QuoteProductImage";
import { QuotePageContext } from "../Quote_Page";
import { QuotePriceContext } from "../Quote_Price";
import { approve_quote, get_quote_detail } from "../../../api/main/orders/Quote_api";
import { CurrencyFormatterLowercase } from "../../component_items/Ag-grid/money_formatter";



const CustomForm = ({ quoteInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(QuotePriceContext);


    const [loading, setLoading] = useState(true);



    const [quote, setQuote] = useState(null)
    const [product, setProduct] = useState(null)


    const [saleStaff, setSaleStaff] = useState(null)
    const [designStaff, setDesignStaff] = useState(null)
    const [productionStaff, setProductionStaff] = useState(null)

    const [metalList, setMetalList] = useState([]);
    const [diamondList, setDiamondList] = useState([])
    const [note, setNote] = useState(null);

    useEffect(() => {
        const setAttribute = async () => {

            const formData = new FormData();
            formData.append('quote_id', quoteInfo.id);
            const detail_data = await get_quote_detail(formData);
            const quote_detail = detail_data.data.quote_detail;

            setQuote(quote_detail)
            setProduct(quote_detail.product)


            setSaleStaff(quote_detail.sale_staff);
            setDesignStaff(quote_detail.design_staff);
            setProductionStaff(quote_detail.production_staff);

            setMetalList(quote_detail.product.product_metal)
            setDiamondList(quote_detail.product.product_diamond)
            setNote(quote_detail.note)


            setLoading(false);
        }
        setAttribute()
    }, [])


    const handleNote = (new_note) => {
        setNote(new_note)
        //console.log("new note", new_note)
    }

    const handleSubmit = async (approve) => {


        const approval = {
            quote_id: quote.id,
            approve: approve,
            note: note
        }
        //console.log('approval', approval)
        const formData = new FormData();
        formData.append('approval', JSON.stringify(approval));

        await get_account_list();

        let response = await approve_quote(formData, 'Quote ID ' + quote.id);

        if (response.success) {
            handleDataChange();
            onClose();
        }
        dispatch(setToast(response.mess))




    }


    return (

        <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
        >
            {loading ? <CButton className="w-100" color="secondary" disabled>
                <CSpinner as="span" size="sm" aria-hidden="true" />
                Loading...
            </CButton> :
                <>



                    <CCol lg={6} className="d-flex flex-column">
                        <AccountCard account={quote.account} avatarSize={100} cardHeight={'120px'} />
                        <div className='flex-grow-1'>
                            <NoteCard minRows={8} maxRows={20} isLoading={loading} note={note} handleChange={handleNote} cardHeight={'100%'} />

                        </div>
                    </CCol>
                    <CCol lg={6}>
                        <div style={{ height: 'fit-content' }}>
                            <QuoteDetailCard quote={quote} />
                        </div>
                        <div className="mt-1" style={{ height: 'fit-content' }}  >

                            <CCard className="h-100">
                                <CCardHeader className="text-center text-light fw-bold" >
                                    ADDITIONAL INFORMATION
                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-between">

                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center' >
                                            <span style={{ fontSize: '15px' }}>Mounting Type: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={product.mounting_type ? product.mounting_type.name : "No Specific Type"} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Mounting Size: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={product.mounting_size} />
                                        </CCol>
                                    </CRow>


                                </CCardBody>
                            </CCard>

                        </div>
                        <div className="h-50 d-flex p-2 flex-column mt-1 rounded w-100"  >
                            <CCard className="" style={{ height: 'fit-content' }}>
                                <CCardHeader className="text-center text-light fw-bold" >
                                    PRODUCT IMAGE
                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-between" >

                                    <QuoteProductImage defaultImage={product.imageUrl} disabled={true} />


                                </CCardBody>
                            </CCard>
                        </div>


                    </CCol>
                    <CCol md={12}>
                        <CRow>
                            <CCol md={4}>
                                <span ><b>Sale Staff: </b></span>

                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                    <ListItemDecorator className='px-2'>
                                        <AvatarInput size={30} src={saleStaff.imageUrl} />
                                    </ListItemDecorator>
                                    {saleStaff.fullname}
                                </CButton>

                            </CCol>
                            <CCol md={4}>
                                <span><b>Design Staff: </b></span>

                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                    <ListItemDecorator className='px-2'>
                                        <AvatarInput size={30} src={designStaff.imageUrl} />
                                    </ListItemDecorator>
                                    {designStaff.fullname}
                                </CButton>

                            </CCol>
                            <CCol md={4}>
                                <span><b>Production Staff: </b></span>

                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                    <ListItemDecorator className='px-2'>
                                        <AvatarInput size={30} src={productionStaff.imageUrl} />
                                    </ListItemDecorator>
                                    {productionStaff.fullname}
                                </CButton>

                            </CCol>
                        </CRow>
                    </CCol>
                    <CCol md={12}>
                        <div className="my-4">
                            <CCard className="bg-light metal-card" >
                                <CCardHeader>
                                    <span className="text-dark fw-bold fs-5 d-flex align-items-center">METAL</span>
                                </CCardHeader>
                                <CCardBody>
                                    <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        {metalList.length > 0 && metalList.map((item, index) => {
                                            return (
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <img width={'100%'} src={item.metal.imageUrl} alt="metal" />

                                                        </Avatar>
                                                    </ListItemAvatar>


                                                    <ListItemText className="text-dark w-25" primary='Type' secondary={item.metal.name} />
                                                    <ListItemText className="text-dark w-25" primary='Volume' secondary={item.volume} />
                                                    <ListItemText className="text-dark w-25" primary='Weight' secondary={item.weight} />
                                                    <ListItemText className="text-dark w-25" primary='Caculated Price'
                                                        secondary={

                                                            <CurrencyFormatterLowercase value={item.price} />


                                                        } />

                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                    <CRow className="w-100 text-end d-flex justify-content-end">
                                        <CCol xl={2} className="p-0 m-0 d-flex  align-items-center text-end">
                                            <span className="text-danger fw-bold fs-5">Metal Sum: </span>
                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                                {/* {metalList.reduce((total, item) => total + item.price, 0)} vnd */}
                                                <CurrencyFormatterLowercase value={metalList.reduce((total, item) => total + item.price, 0)} />
                                            </span>

                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </div>
                        <div className="my-4">
                            <CCard className="bg-light metal-card" >
                                <CCardHeader   >

                                    <span className="text-dark fw-bold fs-5 d-flex align-items-center">Diamond</span>

                                </CCardHeader>
                                <CCardBody>
                                    <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        {diamondList.length > 0 && diamondList.map((item, index) => {
                                            return (
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <img width={'100%'} src={item.diamond.imageUrl} alt="metal" />

                                                        </Avatar>

                                                    </ListItemAvatar>
                                                    <ListItemText className="text-dark w-25" primary='Shape' secondary={item.diamond_shape.name} />
                                                    <ListItemText className="text-dark w-25" primary='Size' secondary={item.diamond.size} />
                                                    <ListItemText className="text-dark w-25" primary='Origin' secondary={item.diamond.diamond_origin.name} />
                                                    <ListItemText className="text-dark w-25" primary='Color' secondary={item.diamond.diamond_color.name} />
                                                    <ListItemText className="text-dark w-25" primary='Clarity' secondary={item.diamond.diamond_clarity.name} />
                                                    <ListItemText className="text-dark w-25" primary='Cut' secondary={item.diamond.diamond_cut.name} />
                                                    <ListItemText className="text-dark w-25" primary='Count' secondary={item.count} />
                                                    <ListItemText className="text-dark w-25" primary='Total Price' secondary={<CurrencyFormatterLowercase value={item.price} />} />
                                                    {diamondList.length == 0 &&
                                                        <IconButton onClick={() => handleRemove(index)} aria-label="delete" size="large" color="error">
                                                            <XCircle size={30} color="crimson" weight="duotone" />
                                                        </IconButton>
                                                    }
                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                    <CRow className="w-100  text-end d-flex justify-content-end">
                                        <CCol xl={2} className="p-0 m-0 d-flex  align-items-center">
                                            <span className="text-danger fw-bold fs-5">Diamond Sum: </span>
                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">

                                                {/* {diamondList.reduce((total, item) => total + item.price, 0)} vnd */}
                                                <CurrencyFormatterLowercase value={diamondList.reduce((total, item) => total + item.price, 0)} />
                                            </span>

                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </div>
                    </CCol>
                    <CCol md={12}>

                        <div className="my-0">
                            <CCard className="bg-light metal-card" >
                                <CCardHeader   >

                                    <span className="text-dark fw-bold fs-5 d-flex align-items-center">Quote Summary</span>

                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-center">
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-dark fw-bold fs-5 ">Product Price: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={quote.product_price} />
                                                {/* {diamondList.reduce((total, item) => total + item.price, 0)}000000 vnd */}
                                            </span>

                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-dark fw-bold fs-5">Profit Price: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={quote.product_price * (quote.profit_rate / 100)} />
                                                &nbsp;({quote.profit_rate}%)</span>

                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center ">
                                            <span className="text-dark fw-bold fs-5 ">Production Price: </span>
                                        </CCol>
                                        <CCol lg={3} className=" p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={quote.production_price} />

                                                {/* {quote.production_price} vnd */}
                                                </span>

                                        </CCol>
                                    </CRow>

                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-danger fw-bold fs-4">Total: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                            <CurrencyFormatterLowercase value={quote.total_price} />

                                            </span>

                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </div>
                    </CCol>
                    <CCol xs={12} className="d-flex justify-content-center align-items-center">
                        <CButton className="mx-2" color="danger" onClick={() => handleSubmit(false)}  >
                            Decline
                        </CButton>
                        |
                        <CButton className="mx-2" color="success" onClick={(e) => handleSubmit(true)}  >
                            Approve
                        </CButton>

                    </CCol>
                </>}
        </CForm>
    )
}

const QuoteApprove = ({ quote, onClose }) => {
    return (
        <CustomForm quoteInfo={quote} onClose={onClose} />
    );
};

export default QuoteApprove;

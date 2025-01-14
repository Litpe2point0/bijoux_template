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
    CInputGroupText,
    CInputGroup,
    CCardText
} from '@coreui/react'
import { get_account_list } from "../../../../api/main/accounts/Account_api";
import AvatarUpload from "../../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../../redux/notification/toastSlice";
import { useNavigate } from "react-router-dom";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import AvatarInput from "../../../component_items/Avatar/Avatar";
import { get } from "jquery";
import DiamondCard from "../../../Sale_staff/Modal_body/model/widget/DiamondCard";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize, hexToRgb } from "@mui/material";
import QuoteProductImage from "../../Quote widget/QuoteProductImage";
import { Pencil } from "phosphor-react";
import { AspectRatio } from "@mui/joy";
import { DiamondPageContext } from "../../Diamond_Page";
import { get_diamond_detail, set_deactivate_diamond, update_price_diamond } from "../../../../api/main/items/Diamond_api";
import { CurrencyFormatterText } from "../../../component_items/Ag-grid/money_formatter";





const CustomForm = ({ diamondInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(DiamondPageContext);

    const [loading, setLoading] = useState(true);



    const [diamond, setDiamond] = useState(null)
    const [price, setPrice] = useState(0);

    // const [approve, setApprove] = useState(null);
    useEffect(() => {
        const setAttribute = async () => {
            const formData = new FormData();
            formData.append('diamond_id', diamondInfo.id);
            const detail_data =await get_diamond_detail(formData);


            const diamond_detail = detail_data.data.diamond
            
            //console.log("quote", quoteInfo)
            // gọi api lấy quote detail từ diamondInfo.id 
            setDiamond(diamond_detail)


            setLoading(false);
        }
        setAttribute()
    }, [])



    const handleActivate = async (new_activate) => {
        const deactivate = {
            diamond_id: diamond.id,
            deactivate: new_activate == 0 ? false : true
        }
        //console.log('deactivate', deactivate)
        const formData = new FormData();
        formData.append('deactivate', JSON.stringify(deactivate));



        let response = await set_deactivate_diamond(formData, 'Diamond ID ' + diamond.id);

        if (response.success) {
            handleDataChange();
            onClose();
        }
        dispatch(setToast(response.mess))
    }

    const handlePriceChange = async () => {


        const update_price = {
            diamond_id: diamond.id,
            price: price,

        }

        //console.log('update_price', update_price)
        const formData = new FormData();
        formData.append('update_price', JSON.stringify(update_price));

        
        let response = await update_price_diamond(formData, 'Diamond ID ' + diamondInfo.id);

        if (response.success) {
            handleDataChange();
            onClose();
        }
        dispatch(setToast(response.mess))


    }


    return (

        <CForm
            className="row needs-validation"

        >
            {loading ? <CButton className="w-100" color="secondary" disabled>
                <CSpinner as="span" size="sm" aria-hidden="true" />
                Loading...
            </CButton> :
                <>
                    <CRow className="my-2">
                        <div style={{ height: '100%' }}  >

                            <CCard className="h-100">
                                <CCardHeader className="text-center text-light fw-bold" >
                                    CURRENT INFORMATION
                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-between ">
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center' >
                                            <span style={{ fontSize: '15px' }}>Diamond ID: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={'#' + diamond.id} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center' >
                                            <span style={{ fontSize: '15px' }}>Diamond Color: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={diamond.diamond_color.name} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Diamond Origin: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={diamond.diamond_origin.name} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Diamond Clarity: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={diamond.diamond_clarity.name} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Diamond Cut : </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={diamond.diamond_cut.name } />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Current Price : </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={CurrencyFormatterText(diamond.price)+' vnd'+` (updated date: ${diamond.created} )` } />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Status: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className={"h-75 w-100 quote-detail-card " + (diamond.deactivated == 0 ? 'text-success' : 'text-danger')} defaultValue={diamond.deactivated == 0 ? 'activated' : 'deactivated'} />
                                        </CCol>
                                    </CRow>


                                </CCardBody>
                            </CCard>


                        </div>
                    </CRow>
                    <CRow className="my-2 h-25" style={{ height: '100px' }}>

                        <CCol md={12} style={{ height: 'fit-content' }}>
                            <CCard >
                                <CCardHeader className="text-center text-light fw-bold" >
                                    NEW PRICE
                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-between ">

                                    <CRow className="w-100">
                                        <CCol sm={6} md={6} lg={6} >
                                            <span className="text-light">New Price: </span>
                                        </CCol>
                                        <CCol sm={6} md={6} lg={6} >

                                            <CInputGroup >
                                                <CFormInput type="number" min={0} className="h-50 quote-detail-card" defaultValue={0} onChange={(e) =>
                                                    setPrice(isNaN(parseFloat(e.target.value)) || parseFloat(e.target.value)<0  ? 0 : parseFloat(e.target.value))
                                                } />
                                                <CInputGroupText className="px-1 py-0">
                                                    <Pencil size={15} color="white" weight="duotone" />
                                                </CInputGroupText>
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>


                    </CRow>



                    <CCol xs={12} className="d-flex justify-content-center align-items-center my-4">
                        <CButton disabled={price == 0} className="mx-2" color={(price == 0) ? 'secondary' : 'success'} onClick={() => handlePriceChange()}  >
                            {(price == 0) ? "Enter New Price For Update" : 'Update Price'}
                        </CButton>
                        |
                        <CButton className="mx-2" color={diamond.deactivated == 0 ? "danger" : "info"} value={diamond.deactivated == 0 ? 1 : 0} onClick={(e) => handleActivate(e.target.value)}  >
                            {diamond.deactivated == 0 ? 'Deactivate' : 'Activate'}
                        </CButton>

                    </CCol>
                </>}
        </CForm>
    )
}

const DiamondUpdate = ({ diamond, onClose }) => {
    return (
        <CustomForm diamondInfo={diamond} onClose={onClose} />
    );
};

export default DiamondUpdate;

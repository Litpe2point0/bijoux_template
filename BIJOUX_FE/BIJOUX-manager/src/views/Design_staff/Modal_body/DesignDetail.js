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
    CPlaceholder,
    CPopover,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    CInputGroup,
    CInputGroupText
} from '@coreui/react'
import { get_account_list } from "../../../api/main/accounts/Account_api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { clearToast, setToast } from "../../../redux/notification/toastSlice";
import { FaUserCheck } from "react-icons/fa";
import DateTimePicker from "../../component_items/DatePicker/DateTimePicker";
import OrderDetailCard from "../Order widget/OrderDetailCard";
import NoteCard from "../Order widget/NoteCard";
import { useNavigate } from "react-router-dom";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import AvatarInput from "../../component_items/Avatar/Avatar";
import { get } from "jquery";
import MetalCard from "./model/widget/MetalCard";
import DiamondCard from "./model/widget/DiamondCard";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
import QuoteProductImage from "../../Manager/Quote widget/QuoteProductImage";
import AccountCard from "../../Manager/Quote widget/AccountCard";
import { DesignPageContext } from "../Design_Page";
import { get_design_process_detail } from "../../../api/main/orders/Order_api";
import { CurrencyFormatterLowercase } from "../../component_items/Ag-grid/money_formatter";



const CustomForm = ({ designInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(DesignPageContext)

    const [loading, setLoading] = useState(true);
    const [handleImageChange, setHandleImageChange] = useState(false);


    const [designProcess, setDesignProcess] = useState(null)
    const [order, setOrder] = useState(null)
    const [product, setProduct] = useState(null)


    const [saleStaff, setSaleStaff] = useState(null)
    const [designStaff, setDesignStaff] = useState(null)
    const [productionStaff, setProductionStaff] = useState(null)

    //previous version
    const [previousMetalList, setPreviousMetalList] = useState([]);
    const [previousDiamondList, setPreviousDiamondList] = useState([])

    //updating version
    const [updatingMetalList, setUpdatingMetalList] = useState([]);
    const [updatingDiamondList, setUpdatingDiamondList] = useState([])



    //report
    const [note, setNote] = useState(null);
    const [profitRate, setProfitRate] = useState(null);
    const [productionPrice, setProductionPrice] = useState(null);

    const [totalPrice, setTotalPrice] = useState(null);

    useEffect(() => {
        const setAttribute = async () => {

            await get_account_list();
            //console.log("quote", quoteInfo)
            // gọi api lấy design process detail từ designInfo.id
            const formData = new FormData();
            formData.append('design_process_id', designInfo.id);
            const detail_data = await get_design_process_detail(formData);


            const design_process = detail_data.data.design_process
            setDesignProcess(design_process)


            setOrder(design_process.order)
            setProduct(design_process.order.product)
            setNote(design_process.order.note)

            setSaleStaff(design_process.order.sale_staff);
            setDesignStaff(design_process.order.design_staff);
            setProductionStaff(design_process.order.production_staff);

            setPreviousMetalList(design_process.order.product.product_metal.filter(item => item.status == (design_process.design_process_status.id == 3 ? 2 : 1)))
            setPreviousDiamondList(design_process.order.product.product_diamond.filter(item => item.status == (design_process.design_process_status.id == 3 ? 2 : 1)))

            setUpdatingMetalList(design_process.order.product.product_metal.filter(item => item.status == (design_process.design_process_status.id == 3 ? 1 : 0)))
            setUpdatingDiamondList(design_process.order.product.product_diamond.filter(item => item.status == (design_process.design_process_status.id == 3 ? 1 : 0)))


            setProfitRate(design_process.profit_rate);
            setProductionPrice(design_process.production_price);
            setTotalPrice(design_process.total_price)



            setLoading(false);
        }
        setAttribute()
    }, [])


    useEffect(() => {
        if(!loading){
            setTotalPrice(productionPrice + designProcess.product_price * (100 + profitRate)/100)
        }
    }, [profitRate, productionPrice])
    return (

        <CForm
            className="row g-3 needs-validation"
        >
            {loading ? <CButton className="w-100" color="secondary" disabled>
                <CSpinner as="span" size="sm" aria-hidden="true" />
                Loading...
            </CButton> :
                <>



                    <CCol lg={6} className="d-flex flex-column">
                        <CAccordion >
                            <CAccordionItem>
                                <CAccordionHeader>CUSTOMER INFORMATION</CAccordionHeader>
                                <CAccordionBody>
                                    <AccountCard account={order.account} avatarSize={100} cardHeight={'120px'} />
                                </CAccordionBody>
                            </CAccordionItem>
                        </CAccordion>
                        <div className='flex-grow-1'>
                            <NoteCard mainNote={note} minRows={8} maxRows={20} isLoading={loading} note={designProcess.note}  />

                        </div>
                    </CCol>
                    <CCol lg={6}>
                        <div style={{ height: 'fit-content' }}>
                            <CAccordion >
                                <CAccordionItem>
                                    <CAccordionHeader>INFORMATION OF ORDER</CAccordionHeader>
                                    <CAccordionBody>
                                        <OrderDetailCard order={order} title={'INFORMATION OF ORDER'} />
                                    </CAccordionBody>
                                </CAccordionItem>
                            </CAccordion>
                        </div>
                        <div className="mt-1" style={{ height: 'fit-content' }}  >
                            <CAccordion >
                                <CAccordionItem>
                                    <CAccordionHeader>ADDITIONAL INFORMATION</CAccordionHeader>
                                    <CAccordionBody>
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
                                                        <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={designProcess.mounting_type ? designProcess.mounting_type.name  : 'No Specific Type'}  />
                                                    </CCol>
                                                </CRow>
                                                <CRow>
                                                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                                        <span style={{ fontSize: '15px' }}>Mounting Size: </span>
                                                    </CCol>
                                                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                                        <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={designProcess.mounting_size} />
                                                    </CCol>
                                                </CRow>


                                            </CCardBody>
                                        </CCard>
                                    </CAccordionBody>
                                </CAccordionItem>
                            </CAccordion>


                        </div>
                        <div className="d-flex p-2 flex-column mt-1 rounded w-100 " style={{ height: 'fit-content' }}>
                            <CCard className=" h-100" style={{ height: 'fit-content' }}>
                                <CCardHeader className="text-center text-light fw-bold" >
                                    DESIGNED IMAGE
                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-between" style={{ maxWidth: '100%', maxHeight: '100%' }}  >
                                    <Button
                                        sx={{ fontSize: '8px', fontWeight: 'bold' }}
                                        color="info"
                                        variant="outlined"
                                        className="fw-bold"
                                        onClick={() => {
                                            setHandleImageChange(!handleImageChange);
                                            //console.log(!handleImageChange)
                                            //console.log(product.imageUrl)
                                            //console.log(designProcess.imageUrl)
                                        }}>
                                        {handleImageChange == true ? 'view current image' : 'view previous image'}
                                    </Button>
                                    <QuoteProductImage defaultImage={handleImageChange == true ? product.imageUrl : designProcess.imageUrl} disabled={true} />


                                </CCardBody>
                            </CCard>



                        </div>


                    </CCol>
                    
                    <CCol md={12}>
                        <div className="my-4">
                            <CCard className="bg-light metal-card" >
                                <CCardBody>
                                    <CRow>
                                        <CCol md={6}>
                                            <span className="text-secondary fw-bold fs-5 d-flex align-items-center">Previous </span>
                                            <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                                {previousMetalList.length > 0 && previousMetalList.map((item, index) => {
                                                    return (
                                                        <ListItem>

                                                            <ListItemAvatar>
                                                                <CPopover
                                                                    title="Info"
                                                                    content={
                                                                        <>
                                                                            <div>Volume: {item.volume}</div>
                                                                            <div>Weight: {item.weight}</div>
                                                                        </>
                                                                    }
                                                                    placement="right"
                                                                    trigger={"hover"}
                                                                >
                                                                    <Avatar>
                                                                        <img width={'100%'} src={item.metal.imageUrl} alt="metal" />
                                                                    </Avatar>
                                                                </CPopover>

                                                            </ListItemAvatar>


                                                            <ListItemText
                                                                className="text-dark w-25"
                                                                primary='Type'
                                                                color="secondary"
                                                                secondary={<span className="text-secondary">{item.metal.name}</span>} />

                                                            <ListItemText
                                                                className="text-dark w-25"
                                                                primary='Caculated Price'
                                                                secondary={<span className="text-secondary"><CurrencyFormatterLowercase value={item.price}/></span>} />

                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </CCol>
                                        <CCol md={6}>
                                            <span className="text-success fw-bold fs-5 d-flex align-items-center">Updating</span>

                                            <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                                {updatingMetalList.length > 0 && updatingMetalList.map((item, index) => {
                                                    return (
                                                        <ListItem>
                                                            <ListItemAvatar>
                                                                <CPopover
                                                                    title="Info"
                                                                    content={
                                                                        <>
                                                                            <div>Volume: {item.volume}</div>
                                                                            <div>Weight: {item.weight}</div>
                                                                        </>
                                                                    }
                                                                    placement="right"
                                                                    trigger={"hover"}
                                                                >
                                                                    <Avatar>
                                                                        <img width={'100%'} src={item.metal.imageUrl} alt="metal" />
                                                                    </Avatar>
                                                                </CPopover>

                                                            </ListItemAvatar>


                                                            <ListItemText
                                                                className="text-dark w-25"
                                                                primary='Type'
                                                                secondary={<span className="text-success">{item.metal.name}</span>} />

                                                            <ListItemText
                                                                className="text-dark w-25"
                                                                primary='Carculated Price'
                                                                secondary={<span className="text-success"><CurrencyFormatterLowercase value={item.price}/></span>} />

                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </CCol>
                                    </CRow>

                                </CCardBody>
                            </CCard>
                        </div>
                        <div className="my-4">
                            <CCard className="bg-light metal-card" >

                                <CCardBody>



                                    <CRow>
                                        <CCol md={6}>
                                            <span className="text-secondary fw-bold fs-5 d-flex align-items-center">Previous</span>
                                            <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                                {previousDiamondList.length > 0 && previousDiamondList.map((item, index) => {
                                                    return (
                                                        <ListItem>
                                                            <ListItemAvatar>

                                                                <CPopover
                                                                    title="Info"
                                                                    content={
                                                                        <>
                                                                            <div>Shape: {item.diamond_shape.name}</div>
                                                                            <div>Size: {item.diamond.size}</div>
                                                                            <div>Origin: {item.diamond.diamond_origin.name}</div>
                                                                            <div>Color: {item.diamond.diamond_color.name}</div>
                                                                            <div>Clarity: {item.diamond.diamond_clarity.name}</div>
                                                                            <div>Cut: {item.diamond.diamond_cut.name}</div>

                                                                        </>
                                                                    }
                                                                    placement="right"
                                                                    trigger={"hover"}
                                                                >
                                                                    <Avatar>
                                                                        <img width={'100%'} src={item.diamond.imageUrl} alt="metal" />
                                                                    </Avatar>
                                                                </CPopover>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                className="text-dark w-25"
                                                                primary='Count'
                                                                secondary={<span className="text-secondary">{item.count}</span>} />
                                                            <ListItemText
                                                                className="text-dark w-25"
                                                                primary='Total Price'
                                                                secondary={<span className="text-secondary"><CurrencyFormatterLowercase value={item.price}/></span>} />

                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </CCol>
                                        <CCol md={6}>
                                            <span className="text-success fw-bold fs-5 d-flex align-items-center">Updating</span>
                                            <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                                {updatingDiamondList.length > 0 && updatingDiamondList.map((item, index) => {
                                                    return (
                                                        <ListItem>
                                                            <ListItemAvatar>

                                                                <CPopover
                                                                    title="Info"
                                                                    content={
                                                                        <>
                                                                            <div>Shape: {item.diamond_shape.name}</div>
                                                                            <div>Size: {item.diamond.size}</div>
                                                                            <div>Origin: {item.diamond.diamond_origin.name}</div>
                                                                            <div>Color: {item.diamond.diamond_color.name}</div>
                                                                            <div>Clarity: {item.diamond.diamond_clarity.name}</div>
                                                                            <div>Cut: {item.diamond.diamond_cut.name}</div>

                                                                        </>
                                                                    }
                                                                    placement="right"
                                                                    trigger={"hover"}
                                                                >
                                                                    <Avatar>
                                                                        <img width={'100%'} src={item.diamond.imageUrl} alt="metal" />
                                                                    </Avatar>
                                                                </CPopover>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                className="text-dark w-25"
                                                                primary='Count'
                                                                secondary={<span className="text-success">{item.count}</span>} />
                                                            <ListItemText
                                                                className="text-dark w-25"
                                                                primary='Total Price'
                                                                secondary={<span className="text-success"><CurrencyFormatterLowercase value={item.price}/></span>} />

                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </CCol>
                                    </CRow>
                              
                                </CCardBody>
                            </CCard>
                        </div>
                    </CCol>

                </>}
        </CForm>
    )
}

const DesignDetail = ({ designProcess, onClose }) => {
    return (
        <CustomForm designInfo={designProcess} onClose={onClose} />
    );
};

export default DesignDetail;

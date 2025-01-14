import React, { useContext, useEffect, useState, useRef, createContext } from "react";

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
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    CPopover
} from '@coreui/react'
import { get_account_list } from "../../../api/main/accounts/Account_api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../redux/notification/toastSlice";
import { FaUserCheck } from "react-icons/fa";
import DateTimePicker from "../../component_items/DatePicker/DateTimePicker";
import OrderDetailCard from "./OrderDetailCard";

import { useNavigate } from "react-router-dom";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import AvatarInput from "../../component_items/Avatar/Avatar";
import { get } from "jquery";
import MetalCard from "../Modal_body/model/widget/MetalCard";
import DiamondCard from "../Modal_body/model/widget/DiamondCard";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize, Typography } from "@mui/material";
import AssignCard from "../../Manager/Quote widget/AssignCard";
import QuoteProductImage from "../../Manager/Quote widget/QuoteProductImage";
import AccountCard from "../../Manager/Quote widget/AccountCard";
import NoteCard from "../../Manager/Quote widget/NoteCard";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Modal_Button from "../../component_items/Modal/ModalButton";
import ProductionStatusChange from "../Modal_body/ProductionStatusChange";
import UploadSingle from "./UploadSingle";
import { ArrowCircleDown } from "phosphor-react";
import ProductionComplete from "../Modal_body/ProductionComplete";
import { add_production_process, get_order_detail, get_production_process_list } from "../../../api/main/orders/Order_api";
import { CurrencyFormatterLowercase } from "../../component_items/Ag-grid/money_formatter";



export const ProductionStatusContext = createContext();

const CustomForm = ({ orderInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [order, setOrder] = useState(null)
    const [product, setProduct] = useState(null)

    const [productionProcessList, setProductionProcessList] = useState([])
    const [currentProductionProcess, setCurrentProductionProcess] = useState(null)

    const [saleStaff, setSaleStaff] = useState(null)
    const [designStaff, setDesignStaff] = useState(null)
    const [productionStaff, setProductionStaff] = useState(null)

    const [metalList, setMetalList] = useState([]);
    const [diamondList, setDiamondList] = useState([])
    const [note, setNote] = useState(null);

    const handleProductionStatus = async () => {

        const formData = new FormData();
        formData.append('order_id', orderInfo.id);
        const detail_data = await get_order_detail(formData);
        const order_detail = detail_data.data.order_detail


        setOrder(order_detail)
        setProduct(order_detail.product)
        //console.log('order_detail.product', order_detail.product)

        setSaleStaff(order_detail.sale_staff);
        setDesignStaff(order_detail.design_staff);
        setProductionStaff(order_detail.production_staff);

        setMetalList(order_detail.product.product_metal)
        setDiamondList(order_detail.product.product_diamond)
        setNote(order_detail.note)


        const formData2 = new FormData();
        formData2.append('order_id', orderInfo.id);
        const production_status_list = await get_production_process_list(formData2);


        setProductionProcessList(production_status_list.data)
        setCurrentProductionProcess(production_status_list.data[production_status_list.data.length - 1])

        setLoading(false);
    }

    useEffect(() => {

        handleProductionStatus()
    }, [])


    const handleNote = (new_note) => {
        setNote(new_note)
        //console.log("new note", new_note)
    }

    const handleDataChange = () => {
        setLoading(true);
        handleProductionStatus()
        //updateProductinStatus()
    }


    return (
        <ProductionStatusContext.Provider value={{ order: order, handleDataChange: handleDataChange }}>
            <CForm
                className="row g-3 needs-validation"

            >
                {loading ? <CButton className="w-100" color="secondary" disabled>
                    <CSpinner as="span" size="sm" aria-hidden="true" />
                    Loading...
                </CButton> :
                    <>

                        <CCol lg={6} className="d-flex flex-column">
                            <AccountCard account={order.account} avatarSize={100} cardHeight={'120px'} />
                            <div className='flex-grow-1'>
                                <NoteCard disabled={true} minRows={8} maxRows={20} isLoading={loading} note={note} handleChange={handleNote} cardHeight={'100%'} />

                            </div>
                        </CCol>
                        <CCol lg={6}>
                            <div style={{ height: 'fit-content' }}>
                                <OrderDetailCard order={order} title={'INFORMATION OF ORDER'} />
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

                            <CRow className="d-flex justify-content-center">
                                {order.order_type.id == 2 &&
                                    <>
                                        <CCol md={4}>
                                            <span ><b>Sale Staff: </b></span>
                                            <CPopover
                                                title="Contact Info"
                                                content={
                                                    <>
                                                        <div>Phone Number: {saleStaff.phone}</div>
                                                        <div>Email: {saleStaff.email}</div>
                                                    </>
                                                }
                                                placement="right"
                                                trigger={"hover"}
                                            >
                                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                                    <ListItemDecorator className='px-2'>
                                                        <AvatarInput size={30} src={saleStaff.imageUrl} />
                                                    </ListItemDecorator>
                                                    {saleStaff.fullname}
                                                </CButton>
                                            </CPopover>


                                        </CCol>
                                        <CCol md={4}>
                                            <span><b>Design Staff: </b></span>
                                            <CPopover
                                                title="Contact Info"
                                                content={
                                                    <>
                                                        <div>Phone Number: {designStaff.phone}</div>
                                                        <div>Email: {designStaff.email}</div>
                                                    </>
                                                }
                                                placement="right"
                                                trigger={"hover"}
                                            >
                                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                                    <ListItemDecorator className='px-2'>
                                                        <AvatarInput size={30} src={designStaff.imageUrl} />
                                                    </ListItemDecorator>
                                                    {designStaff.fullname}
                                                </CButton>
                                            </CPopover>
                                        </CCol>
                                    </>
                                }

                                <CCol md={4}>
                                    <span><b>Production Staff: </b></span>
                                    <CPopover
                                        title="Contact Info"
                                        content={
                                            <>
                                                <div>Phone Number: {productionStaff.phone}</div>
                                                <div>Email: {productionStaff.email}</div>
                                            </>
                                        }
                                        placement="right"
                                        trigger={"hover"}
                                    >
                                        <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                            <ListItemDecorator className='px-2'>
                                                <AvatarInput size={30} src={productionStaff.imageUrl} />
                                            </ListItemDecorator>
                                            {productionStaff.fullname}
                                        </CButton>
                                    </CPopover>


                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md={12}>

                            <div className="my-1">
                                <CAccordion >
                                    <CAccordionItem>
                                        <CAccordionHeader>METAL LIST</CAccordionHeader>
                                        <CAccordionBody>
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
                                                                    <ListItemText className="text-dark w-25" primary='Caculated Price' secondary={<CurrencyFormatterLowercase value={item.price}/>} />

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
                                                            <CurrencyFormatterLowercase value={metalList.reduce((total, item) => total + item.price, 0)}/>
                                                            {/* {metalList.reduce((total, item) => total + item.price, 0)} vnd */}
                                                            </span>

                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </CAccordion>

                            </div>
                            <div className="my-1">
                                <CAccordion >
                                    <CAccordionItem>
                                        <CAccordionHeader>DIAMOND LIST</CAccordionHeader>
                                        <CAccordionBody>
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
                                                                    <ListItemText className="text-dark w-25" primary='Total Price' secondary={<CurrencyFormatterLowercase value={item.price}/>} />
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
                                                            <CurrencyFormatterLowercase value={diamondList.reduce((total, item) => total + item.price, 0)}/>
                                                            {/* {diamondList.reduce((total, item) => total + item.price, 0)} vnd */}
                                                            </span>

                                                        </CCol>
                                                    </CRow>
                                                </CCardBody>
                                            </CCard>
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </CAccordion>

                            </div>
                            <div className="my-1">
                                <CAccordion activeItemKey={1}>
                                    <CAccordionItem itemKey={1}>
                                        <CAccordionHeader>PRODUCTION PROCESS</CAccordionHeader>
                                        <CAccordionBody>
                                            <Timeline position="right">
                                                {productionProcessList.map((item, index) => {
                                                    //console.log("listingnownfownefo", item)
                                                    return <TimelineItem>
                                                        <TimelineOppositeContent
                                                            sx={{ m: 'auto 0' }}
                                                            align="right"
                                                            variant="body2"
                                                            color="textSuccess"
                                                        >
                                                            {item.created}
                                                        </TimelineOppositeContent>
                                                        <TimelineSeparator>
                                                            <TimelineConnector sx={{ bgcolor: 'success.main' }} />
                                                            <TimelineDot color="secondary" variant="outlined">
                                                                <ArrowCircleDown size={20} weight="duotone" color="aqua " />
                                                            </TimelineDot>
                                                            <TimelineConnector sx={{ bgcolor: 'success.main' }} />
                                                        </TimelineSeparator>
                                                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                                                            <div className="p-1 rounded-1 border border-3 border-secondary d-flex align-items-center justify-content-between">
                                                                <Typography variant="h6" component="span">
                                                                    {item.production_status.name}
                                                                </Typography>
                                                                <span className="w-25">
                                                                    {
                                                                        item.imageUrl &&
                                                                        <Typography>
                                                                            <Modal_Button
                                                                                size={'lg'}
                                                                                title={"Production Process Image"}
                                                                                content={
                                                                                    <Button size="small">View Image</Button>
                                                                                }
                                                                                color={"light"} >
                                                                                <UploadSingle defaultImage={item.imageUrl} disabled={true} />
                                                                            </Modal_Button>
                                                                        </Typography>
                                                                    }
                                                                </span>

                                                            </div>

                                                        </TimelineContent>
                                                    </TimelineItem>

                                                })}

                                            </Timeline>
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </CAccordion>

                            </div>
                        </CCol>
                        <CCol xs={12} className="d-flex justify-content-center align-items-center">
                            <div style={{ width: 'fit-content' }}>
                                {order.order_status.id == 3 && currentProductionProcess.production_status.id != 6 &&

                                    <Modal_Button
                                        size={'lg'}
                                        title={"Set Production Status"}
                                        content={
                                            <CButton color="success w-100" >
                                                Update Production Status
                                            </CButton>
                                        }
                                        color={"light"} >
                                        <ProductionStatusChange currentProductionStatus={currentProductionProcess.production_status} />
                                    </Modal_Button>
                                }
                                {order.order_status.id == 3 && currentProductionProcess.production_status.id == 6 &&
                                    <Modal_Button
                                        size={'lg'}
                                        title={"Production Completion Confirmation"}
                                        content={
                                            <CButton color="success w-100" >
                                                Confirm To Finish
                                            </CButton>
                                        }
                                        color={"light"} >
                                        <ProductionComplete currentProductionProcess={currentProductionProcess} />
                                    </Modal_Button>
                                }

                            </div>
                        </CCol>
                    </>}
            </CForm>
        </ProductionStatusContext.Provider>

    )
}

const OrderDetail = ({ order, onClose }) => {
    return (
        <CustomForm orderInfo={order} onClose={onClose} />
    );
};

export default OrderDetail;

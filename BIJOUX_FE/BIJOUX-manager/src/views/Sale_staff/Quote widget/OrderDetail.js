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
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody
} from '@coreui/react'
import { get_account_list, get_staff_list } from "../../../api/main/accounts/Account_api";
import { useDispatch } from "react-redux";
import { setToast } from "../../../redux/notification/toastSlice";

import { useNavigate } from "react-router-dom";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import AvatarInput from "../../component_items/Avatar/Avatar";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
import QuoteProductImage from "../../Manager/Quote widget/QuoteProductImage";
import AccountCard from "../../Manager/Quote widget/AccountCard";
import NoteCard from "../../Manager/Quote widget/NoteCard";
import { confirm_shipped, get_order_detail } from "../../../api/main/orders/Order_api";
import { CurrencyFormatterLowercase } from "../../component_items/Ag-grid/money_formatter";
import { SaleOrderPageContext } from "../Order_Page";
import OrderDetailCard from "./OrderDetailCard";





const CustomForm = ({ orderInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(SaleOrderPageContext)


    const [loading, setLoading] = useState(true);
    const [isReassign, setIsReassign] = useState(false);

    const [order, setOrder] = useState(null)
    const [product, setProduct] = useState(null)

    const [saleStaffs, setSaleStaffs] = useState(null)
    const [designStaffs, setDesignStaffs] = useState(null)
    const [productionStaffs, setProductionStaffs] = useState(null)


    const [saleStaff, setSaleStaff] = useState(null)
    const [designStaff, setDesignStaff] = useState(null)
    const [productionStaff, setProductionStaff] = useState(null)

    const [metalList, setMetalList] = useState([]);
    const [diamondList, setDiamondList] = useState([])
    const [note, setNote] = useState(null);

    useEffect(() => {
        const setAttribute = async () => {


            const formData = new FormData();
            formData.append('order_id', orderInfo.id);
            const detail_data = await get_order_detail(formData);
            const order_detail = detail_data.data.order_detail


            setOrder(order_detail)
            setProduct(order_detail.product)




            const staffList = await get_staff_list();

            setSaleStaffs(staffList.data.sale_staff_list);
            setDesignStaffs(staffList.data.design_staff_list);
            setProductionStaffs(staffList.data.production_staff_list);



            setSaleStaff(order_detail.sale_staff);
            setDesignStaff(order_detail.design_staff);
            setProductionStaff(order_detail.production_staff);

            setMetalList(order_detail.product.product_metal)
            setDiamondList(order_detail.product.product_diamond)
            setNote(order_detail.note)


            setLoading(false);
        }
        setAttribute()
    }, [])

    const handleAssign = (selectedStaff, role_id) => {
        setIsReassign(true)
        if (role_id == 2) {

            //console.log("sale Staff", selectedStaff)
            setSaleStaff(selectedStaff)
        } else if (role_id == 3) {

            //console.log("design Staff", selectedStaff)
            setDesignStaff(selectedStaff)
        } else if (role_id == 4) {

            //console.log("production Staff", selectedStaff)
            setProductionStaff(selectedStaff)
        }

    }
    const handleReassign = async () => {
        setIsReassign(false)
        await get_account_list();

        const assigned_order = {
            order_id: order.id,
            note: note,
            saleStaff_id: saleStaff.id,
            designStaff_id: designStaff.id,
            productionStaff_id: productionStaff.id
        }
        //dispatch(setToast({ toastShow: true, toastMessage: 'Reassign staffs successfully', toastType: 'success' }))

        dispatch(setToast({ color: 'success', title: 'Order id: ' + orderInfo.id, mess: "Reassign staff successfully !" }))
        onClose()

    }
    const handleNote = (new_note) => {
        setNote(new_note)
        //console.log("new note", new_note)
    }

    const handleSubmit= async () =>{
        
        const formData= new FormData();
        formData.append('order_id', order.id);
        const response = await confirm_shipped(formData,'Order ID ' + order.id);
        if (response.success) {
            handleDataChange();
            onClose();
        }
        dispatch(setToast(response.mess))
    }


    return (

        <CForm
            className="row g-3 needs-validation"

        >
            {loading ? <CButton className="w-100" color="secondary" disabled>
                <CSpinner as="span" size="sm" aria-hidden="true" />
                Loading...
            </CButton> :
                <>
                    {order.delivery_date &&
                        <CCol xs={12}>
                            <span className="text-success fw-normal fst-italic">*The order has been delivered to the customer's address - (delivered date: {order.delivery_date})</span>
                        </CCol>
                    }
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

                                        <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                            {saleStaff ?
                                                <>
                                                    <ListItemDecorator className='px-2'>
                                                        <AvatarInput size={30} src={saleStaff.imageUrl} />
                                                    </ListItemDecorator>
                                                    {saleStaff.fullname}
                                                </>
                                                :
                                                <span className="text-danger">Not Assign Yet !</span>

                                            }

                                        </CButton>

                                    </CCol>
                                    <CCol md={4}>
                                        <span><b>Design Staff: </b></span>

                                        <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                            {designStaff ?
                                                <>
                                                    <ListItemDecorator className='px-2'>
                                                        <AvatarInput size={30} src={designStaff.imageUrl} />
                                                    </ListItemDecorator>
                                                    {designStaff.fullname}
                                                </>
                                                :
                                                <span className="text-danger">Not Assign Yet !</span>

                                            }

                                        </CButton>

                                    </CCol>
                                </>

                            }

                            <CCol md={4}>
                                <span><b>Production Staff: </b></span>

                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                    {productionStaff ?
                                        <>
                                            <ListItemDecorator className='px-2'>
                                                <AvatarInput size={30} src={productionStaff.imageUrl} />
                                            </ListItemDecorator>
                                            {productionStaff.fullname}
                                        </>
                                        :
                                        <span className="text-danger">Not Assign Yet !</span>

                                    }

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
                                                    <ListItemText className="text-dark w-25" primary='Caculated Price' secondary={<CurrencyFormatterLowercase value={item.price} />} />

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
                                                <CurrencyFormatterLowercase value={metalList.reduce((total, item) => total + item.price, 0)} />
                                                {/* {metalList.reduce((total, item) => total + item.price, 0)} vnd */}
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

                                    <span className="text-dark fw-bold fs-5 d-flex align-items-center">Order's Price Summary</span>

                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-center">
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-dark fw-bold fs-5 ">Deposit Has Paid: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                            {/* {order.deposit_has_paid} vnd */}
                                            <CurrencyFormatterLowercase value={order.deposit_has_paid} />
                                            </span>

                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-dark fw-bold fs-5 ">Product Price: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={order.product_price} />
                                            </span>
                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-dark fw-bold fs-5">Profit Price: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={order.product_price * (order.profit_rate / 100)} />
                                                &nbsp;({order.profit_rate}%)
                                            </span>
                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center ">
                                            <span className="text-dark fw-bold fs-5 ">Production Price: </span>
                                        </CCol>
                                        <CCol lg={3} className=" p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={order.production_price} />
                                            </span>
                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center ">
                                            <span className="text-dark fw-bold fs-5 ">Refund Price: </span>
                                        </CCol>
                                        <CCol lg={3} className=" p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={(order.deposit_has_paid - order.total_price) > 0 ? (order.deposit_has_paid - order.total_price) : 0} />
                                            </span>
                                        </CCol>
                                    </CRow>

                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-danger fw-bold fs-4">Total: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={order.total_price} />
                                            </span>
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </div>
                    </CCol>
                    {order.order_status.id == 5 && !order.delivery_date 
                        &&
                        <CCol xs={12} className="d-flex justify-content-center align-items-center">
                            <CButton className="mx-2" color="success" onClick={() => handleSubmit()}  >
                                Confirm The Order Has Been Shipped
                            </CButton>
                        </CCol>
                    }

                </>}
        </CForm >
    )
}

const OrderDetail = ({ order, onClose }) => {
    return (
        <CustomForm orderInfo={order} onClose={onClose} />
    );
};

export default OrderDetail;

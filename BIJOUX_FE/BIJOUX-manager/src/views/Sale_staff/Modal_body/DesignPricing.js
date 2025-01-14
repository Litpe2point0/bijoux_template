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
import QuoteDetailCard from "../Quote widget/QuoteDetailCard";
import NoteCard from "../Quote widget/NoteCard";
import { useNavigate } from "react-router-dom";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import AvatarInput from "../../component_items/Avatar/Avatar";
import { get } from "jquery";
import MetalCard from "./model/widget/MetalCard";
import DiamondCard from "./model/widget/DiamondCard";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
import { ArrowFatLinesRight, CaretDoubleRight, Gear } from "phosphor-react";
import QuoteProductImage from "../../Manager/Quote widget/QuoteProductImage";
import AccountCard from "../../Manager/Quote widget/AccountCard";
import Modal_Button from "../../component_items/Modal/ModalButton";
import ProfitChange from "./ProfitPriceChange";
import ProductionPriceChange from "./ProductionPriceChange";
import { SaleOrderPriceContext } from "../Order_Price";
import { get_design_process_detail, pricing_design_process } from "../../../api/main/orders/Order_api";
import { CurrencyFormatterLowercase } from "../../component_items/Ag-grid/money_formatter";
import OrderDetailCard from "../Quote widget/OrderDetailCard";


const complete_metal_list_previous = (old_list, new_list) => {  // old_list: status 3, new_list: status 1
    if (old_list.length > 0) {
        old_list.forEach((old_item) => {
            const found = new_list.find((new_item) => new_item.metal.id == old_item.metal.id && new_item.volume == old_item.volume)
            if (!found) {
                old_list.splice(old_list.indexOf(old_item), 1);
            }
        })
        new_list.forEach((new_item) => {
            const found = old_list.find((old_item) => old_item.metal.id == new_item.metal.id && old_item.volume == new_item.volume)
            if (!found) {
                old_list.push(new_item)
            }
        }
        )
        return old_list
    } else {
        return new_list
    }
}
const complete_diamond_list_previous = (old_list, new_list) => {   // old_list: status 3, new_list: status 1
    if (old_list.length > 0) {
        old_list.forEach((old_item) => {
            const found = new_list.find((new_item) => new_item.diamond.id == old_item.diamond.id && new_item.count == old_item.count)
            if (!found) {
                old_list.splice(old_list.indexOf(old_item), 1);
            }
        })
        new_list.forEach((new_item) => {
            const found = old_list.find((old_item) => old_item.diamond.id == new_item.diamond.id && old_item.count == new_item.count)
            if (!found) {
                old_list.push(new_item)
            }
        }
        )
        return old_list
    } else {
        return new_list

    }
}
const complete_metal_list_updating = (old_list, current_list, new_list) => { // old_list: status 3, current_list: status 1, new_list: status 0
    const current = complete_metal_list_previous(old_list, current_list)
    new_list.forEach((new_item, index) => {
        const found = current.find((current_item) => current_item.metal.id == new_item.metal.id && current_item.volume == new_item.volume)
        if (found) {
            // new_list.splice(new_list.indexOf(new_item), 1)
            // new_list.push(found)
            new_list[index] = found;
        }
    }
    )
    return new_list
}
const complete_diamond_list_updating = (old_list, current_list, new_list) => { // old_list: status 3, current_list: status 1, new_list: status 0
    const current = complete_diamond_list_previous(old_list, current_list)
    new_list.forEach((new_item, index) => {
        const found = current.find((current_item) => current_item.diamond.id == new_item.diamond.id && current_item.count == new_item.count)
        if (found) {
            // new_list.splice(new_list.indexOf(new_item), 1)
            // new_list.push(found)
            new_list[index] = found;
        }
    }
    )
    return new_list
}

const product_price_calculator = (metal_list, diamond_list) => {
    const metal_price = metal_list.reduce((total, item) => total + item.price, 0)
    const diamond_price = diamond_list.reduce((total, item) => total + item.price, 0)
    const product_price = metal_price + diamond_price
    return product_price
}

const total_calculator = (metal_list, diamond_list, profit_rate, production) => {
    const metal_price = metal_list.reduce((total, item) => total + item.price, 0)
    const diamond_price = diamond_list.reduce((total, item) => total + item.price, 0)
    const product_price = metal_price + diamond_price
    const profit_price = product_price * profit_rate / 100
    const total_price = product_price + profit_price + production
    return total_price
}

const CustomForm = ({ designInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(SaleOrderPriceContext)

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
    const [updatingProductPrice, setUpdatingProductPrice] = useState(null);
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

            

            const metal_old = design_process.order.product.product_metal.filter(item => item.status == 3)
            const metal_new = design_process.order.product.product_metal.filter(item => item.status == 1)

            const diamond_old = design_process.order.product.product_diamond.filter(item => item.status == 3)
            const diamond_new = design_process.order.product.product_diamond.filter(item => item.status == 1)

            const metal_design = design_process.order.product.product_metal.filter(item => item.status == 0)
            const diamond_design = design_process.order.product.product_diamond.filter(item => item.status == 0)


            //console.log('complete_metal_list_previous', complete_metal_list_previous(metal_old, metal_new))
            //console.log('complete_diamond_list_previous', complete_diamond_list_previous(diamond_old, diamond_new))
            //console.log('complete_metal_list_updating', complete_metal_list_updating(metal_old, metal_new, metal_design))
            //console.log('complete_diamond_list_updating', complete_diamond_list_updating(diamond_old, diamond_new, diamond_design))

            const metal_previous = complete_metal_list_previous(metal_old, metal_new)
            const diamond_previous = complete_diamond_list_previous(diamond_old, diamond_new)
            const metal_updating = complete_metal_list_updating(metal_old, metal_new, metal_design)
            const diamond_updating= complete_diamond_list_updating(diamond_old, diamond_new, diamond_design)
            
            setPreviousMetalList(metal_previous)
            setPreviousDiamondList(diamond_previous)

            setUpdatingMetalList(metal_updating)
            setUpdatingDiamondList(diamond_updating)


            setProfitRate(design_process.profit_rate);
            setProductionPrice(design_process.production_price);

            setUpdatingProductPrice(product_price_calculator(metal_updating, diamond_updating))

            //setTotalPrice(design_process.total_price)
            setTotalPrice(total_calculator(metal_updating, diamond_updating, design_process.profit_rate, design_process.production_price))


            setLoading(false);
        }
        setAttribute()
    }, [])


    const handleNote = (new_note) => {
        //console.log(new_note)
        setNote(new_note)
    }

    const handleSubmit = async () => {


        const priced_design_process = {
            design_process_id: designProcess.id,
            production_price: productionPrice,
            profit_rate: profitRate,
            note: note
        }
        //console.log('priced_design_process', priced_design_process)
        const formData = new FormData();
        formData.append('priced_design_process', JSON.stringify(priced_design_process));

        let response = await pricing_design_process(formData, 'Design Process ID ' + designInfo.id);

        if (response.success) {
            handleDataChange();
            onClose();
        }
        dispatch(setToast(response.mess))



    }
    const handleProfitRate = (new_profit_rate) => {
        setProfitRate(new_profit_rate)
    }

    const handleProductionPrice = (new_production_price) => {
        setProductionPrice(new_production_price)
    }
    useEffect(() => {
        if (!loading) {

            //setTotalPrice(productionPrice + designProcess.product_price * (100 + profitRate) / 100)
            setTotalPrice(total_calculator(updatingMetalList, updatingDiamondList, profitRate, productionPrice))
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

                    {order.delivery_date &&
                        <CCol xs={12}>
                            <span className="text-success fw-normal fst-italic">*The order has been delivered to the customer's address - (delivered date: {order.delivery_date})</span>
                        </CCol>
                    }

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
                            <NoteCard mainNote={note} minRows={8} maxRows={20} isLoading={loading} note={designProcess.note} handleChange={handleNote} />

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
                                                        <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={designProcess.mounting_type ? designProcess.mounting_type.name : 'No Specific Type'} />
                                                    </CCol>
                                                </CRow>
                                                <CRow>
                                                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                                        <span style={{ fontSize: '15px' }}>Mounting Size: </span>
                                                    </CCol>
                                                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                                        <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={designProcess.mounting_size ? designProcess.mounting_size : null} />
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
                                {/* <CCardHeader>
                                    <span className="text-dark fw-bold fs-5 d-flex align-items-center">METAL</span>
                                </CCardHeader> */}
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
                                                                    title="Popover title"
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
                                                                secondary={<span className="text-secondary">
                                                                    <CurrencyFormatterLowercase value={item.price} />
                                                                    {/* {item.price} vnd */}
                                                                </span>} />

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
                                                                secondary={<span className="text-success"><CurrencyFormatterLowercase value={item.price} /></span>} />

                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </CCol>
                                    </CRow>


                                    <CRow className="w-100 text-center d-flex justify-content-center">
                                        <CCol md={12} >
                                            <span className="text-danger fw-bold fs-5">Metal Sum </span>
                                        </CCol>

                                        <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center text-nowrap">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={previousMetalList.reduce((total, item) => total + item.price, 0)} />
                                                {/* {previousMetalList.reduce((total, item) => total + item.price, 0)} vnd */}
                                            </span>

                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex  align-items-center justify-content-center">
                                            <CaretDoubleRight size={30} color='gray' weight="light" />

                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center text-nowrap">
                                            <span className="text-success fs-6">
                                                <CurrencyFormatterLowercase value={updatingMetalList.reduce((total, item) => total + item.price, 0)} />
                                                {/* {updatingMetalList.reduce((total, item) => total + item.price, 0)} vnd */}
                                            </span>

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
                                                                secondary={<span className="text-secondary">
                                                                    <CurrencyFormatterLowercase value={item.price} />
                                                                    {/* {item.price} vnd */}
                                                                </span>} />

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
                                                                    title="Popover title"
                                                                    content={
                                                                        <>
                                                                            <div>Shape: {item.diamond_shape.name}</div>
                                                                            <div>Size: {item.diamond.size}</div>
                                                                            <div>Origin: {item.diamond.diamond_origin.name}</div>
                                                                            <div>Color: {item.diamond.diamond_color.name}</div>
                                                                            <div>Clarity: {item.diamond.diamond_clarity.name}</div>
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
                                                                secondary={<span className="text-success"><CurrencyFormatterLowercase value={item.price} /></span>} />

                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100 text-center d-flex justify-content-center">
                                        <CCol md={12}>
                                            <span className="text-danger fw-bold fs-5">Diamond Sum </span>
                                        </CCol>

                                        <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center text-nowrap">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={previousDiamondList.reduce((total, item) => total + item.price, 0)} />
                                                {/* {previousDiamondList.reduce((total, item) => total + item.price, 0)} vnd */}
                                            </span>

                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex  align-items-center justify-content-center">
                                            <CaretDoubleRight size={30} color='gray' weight="light" />

                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center text-nowrap">
                                            <span className="text-success fs-6">
                                                <CurrencyFormatterLowercase value={updatingDiamondList.reduce((total, item) => total + item.price, 0)} />
                                                {/* {updatingDiamondList.reduce((total, item) => total + item.price, 0)} vnd */}
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

                                <CCardBody className="d-flex flex-column justify-content-center">
                                    <CRow className="d-flex justify-content-center">

                                        <CCol md={5} className="p-0">
                                            <span className="text-secondary fw-bold fs-5 d-flex align-items-center">Previous </span>

                                            <CRow className="w-100  text-end d-flex justify-content-center">
                                                <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center">
                                                    <span className="text-dark  fs-5 ">Product Price: </span>
                                                </CCol>
                                                <CCol lg={5} className="p-0 m-0 d-flex align-items-center text-nowrap">
                                                    <span className="text-secondary fs-6">
                                                        <CurrencyFormatterLowercase value={order.product_price} />
                                                        {/* {order.product_price} vnd */}
                                                    </span>

                                                </CCol>
                                            </CRow>
                                            <CRow className="w-100  text-end d-flex justify-content-center">
                                                <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center">
                                                    <span className="text-dark  fs-5">Profit Price: </span>
                                                </CCol>
                                                <CCol lg={5} className="p-0 m-0 d-flex align-items-center text-nowrap">
                                                    <span className="text-secondary fs-6">
                                                        <CurrencyFormatterLowercase value={order.product_price * (order.profit_rate / 100)} />
                                                        &nbsp;({order.profit_rate}%)
                                                    </span>





                                                </CCol>
                                            </CRow>
                                            <CRow className="w-100  text-end d-flex justify-content-center">
                                                <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center ">
                                                    <span className="text-dark  fs-5 ">Production Price: </span>
                                                </CCol>
                                                <CCol lg={5} className=" p-0 m-0 d-flex align-items-center text-nowrap">
                                                    <span className="text-secondary fs-6">
                                                        <CurrencyFormatterLowercase value={order.production_price} />
                                                        {/* {order.production_price} vnd */}
                                                    </span>

                                                </CCol>
                                            </CRow>
                                        </CCol>
                                        {/* <CCol md={1} className="d-flex align-items-center justify-content-center p-0">
                                            <CaretDoubleRight size={30} color='gray' weight="light" />
                                        </CCol> */}
                                        <CCol md={5} className="p-0">
                                            <span className="text-success fw-bold fs-5 d-flex align-items-center">Updating </span>

                                            <CRow className="w-100  text-end d-flex justify-content-center">
                                                <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center">
                                                    <span className="text-dark  fs-5 ">Product Price: </span>
                                                </CCol>
                                                <CCol lg={5} className="p-0 m-0 d-flex align-items-center text-nowrap">
                                                    <span className="text-success fs-6">
                                                        <CurrencyFormatterLowercase value={updatingProductPrice} />
                                                        {/* {designProcess.product_price} vnd */}
                                                    </span>

                                                </CCol>
                                            </CRow>
                                            <CRow className="w-100  text-end d-flex justify-content-center">
                                                <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center">
                                                    <span className="text-dark  fs-5">Profit Price: </span>
                                                </CCol>
                                                <CCol lg={5} className="p-0 m-0 d-flex align-items-center ">
                                                    <span className="text-success fs-6 d-flex align-items-center text-nowrap">
                                                        <CurrencyFormatterLowercase value={updatingProductPrice * (profitRate / 100)} />
                                                        &nbsp;({profitRate}%)
                                                        <div className="flex-grow-1">
                                                            <Modal_Button
                                                                size={'sm'}
                                                                title={"Set Profit Rate"}
                                                                content={<IconButton sx={{ padding: 0 }} color="secondary" aria-label="add an alarm">
                                                                    <Gear size={20} color={'purple'} weight="duotone" />
                                                                </IconButton>}
                                                                color={"light"} >
                                                                <ProfitChange profitRate={profitRate} handleProfitRate={handleProfitRate} />
                                                            </Modal_Button>
                                                        </div>

                                                    </span>
                                                </CCol>
                                            </CRow>
                                            <CRow className="w-100  text-end d-flex justify-content-center">
                                                <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center ">
                                                    <span className="text-dark  fs-5 ">Production Price: </span>
                                                </CCol>
                                                <CCol lg={5} className=" p-0 m-0 d-flex align-items-center ">
                                                    <span className="text-success fs-6 d-flex align-items-center text-nowrap">
                                                        <CurrencyFormatterLowercase value={productionPrice} />
                                                        <div className="flex-grow-1">
                                                            <Modal_Button
                                                                size={'sm'}
                                                                title={"Set Profit Rate"}
                                                                content={<IconButton sx={{ padding: 0 }} color="secondary" aria-label="add an alarm">
                                                                    <Gear size={20} color={'purple'} weight="duotone" />
                                                                </IconButton>}
                                                                color={"light"} >
                                                                <ProductionPriceChange productionPrice={productionPrice} handleProductionPrice={handleProductionPrice} />
                                                            </Modal_Button>
                                                        </div>

                                                    </span>
                                                </CCol>
                                            </CRow>
                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100 text-center d-flex justify-content-center">
                                        <CCol md={12}>
                                            <span className="text-danger w-100 text-center fw-bold fs-5">Total</span>
                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center text-nowrap">
                                            <span className="text-secondary fs-6">
                                                <CurrencyFormatterLowercase value={order.total_price} />
                                                {/* {order.total_price} vnd */}
                                            </span>
                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex  align-items-center justify-content-center">
                                            <CaretDoubleRight size={30} color='gray' weight="light" />
                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center text-nowrap">
                                            <span className="text-success fs-6">
                                                <CurrencyFormatterLowercase value={totalPrice} />
                                                {/* {totalPrice} vnd */}
                                            </span>
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </div>
                    </CCol>
                    <CCol xs={12} className="d-flex justify-content-center align-items-center">
                        <CButton className="mx-2" color="success" onClick={() => handleSubmit()}  >
                            Confirm Pricing
                        </CButton>

                    </CCol>
                </>}
        </CForm>
    )
}

const DesignPricing = ({ designProcess, onClose }) => {
    return (
        <CustomForm designInfo={designProcess} onClose={onClose} />
    );
};

export default DesignPricing;

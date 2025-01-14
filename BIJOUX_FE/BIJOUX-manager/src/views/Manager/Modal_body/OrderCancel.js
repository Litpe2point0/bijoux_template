import React, { useContext, useEffect, useState, useRef } from "react";

import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CRow,
    CSpinner
} from '@coreui/react'
import { get_account_list } from "../../../api/main/accounts/Account_api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../redux/notification/toastSlice";
import { FaUserCheck } from "react-icons/fa";
import NoteCard from "../Quote widget/NoteCard";
import AssignCard from "../Quote widget/AssignCard";
import { useNavigate } from "react-router-dom";
import { queue } from "jquery";
import { OrderPageContext } from "../Order_Page";
import { cancel_order, get_order_detail } from "../../../api/main/orders/Order_api";



const CustomForm = ({ orderInfo, account, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(OrderPageContext);

    const [loading, setLoading] = useState(true);

    const [note, setNote] = useState('');

    useEffect(() => {
        const setAttribute = async () => {
            const formData = new FormData();
            formData.append('order_id', orderInfo.id);
            const detail_data = await get_order_detail(formData);



            const order_detail = detail_data.data.order_detail



            setNote(order_detail.note)

            setLoading(false);
        }
        setAttribute()
    }, [])

    const handleNote = (new_note) => {
        setNote(new_note)
        //console.log("new note", new_note)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else if (form.checkValidity() === true) {

            const cancel = {
                order_id: orderInfo.id,
                note: note != null ? note.trim() : ''
            }
            //console.log('cancel order', cancel)
            const formData = new FormData();
            formData.append('cancel', JSON.stringify(cancel));

            const response = await cancel_order(formData, 'Order ID ' + orderInfo.id);

            if (response.success) {
                handleDataChange();
                onClose();
            }
            dispatch(setToast(response.mess))


        }

    }


    return (
        <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
        >
            {orderInfo.delivery_date &&
                <CCol xs={12}>
                    <span className="text-success fw-normal fst-italic">*The order has been delivered to the customer's address - (delivered date: {orderInfo.delivery_date})</span>
                </CCol>
            }
            <CFormLabel htmlFor="note" className="form-label">This action will not permanent delete the item from the system</CFormLabel>
            <CCol md={12}>
                <NoteCard isLoading={loading} note={note} handleChange={handleNote} />
            </CCol>
            <CCol xs={12} className="d-flex justify-content-center">

                <CButton color="danger" type="submit" disabled={loading} >
                    Sure to cancel
                </CButton>


            </CCol>

        </CForm>
    )
}

const OrderCancel = ({ order, onClose }) => {
    return (
        <CustomForm orderInfo={order} onClose={onClose} />
    );
};

export default OrderCancel;

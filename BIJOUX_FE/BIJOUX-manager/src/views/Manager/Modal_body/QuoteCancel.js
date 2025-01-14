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
import DateTimePicker from "../../component_items/DatePicker/DateTimePicker";
import AccountCard from "../Quote widget/AccountCard";
import QuoteDetailCard from "../Quote widget/QuoteDetailCard";
import NoteCard from "../Quote widget/NoteCard";
import AssignCard from "../Quote widget/AssignCard";
import { useNavigate } from "react-router-dom";
import { queue } from "jquery";
import { QuotePageContext } from "../Quote_Page";
import { cancel_quote } from "../../../api/main/orders/Quote_api";



const CustomForm = ({ quoteInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(QuotePageContext);   

    const [loading, setLoading] = useState(true);

    const [note, setNote] = useState('');

    useEffect(() => {
        const setAttribute = async () => {
            await get_account_list();

            setNote(quoteInfo.note)

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
                quote_id: quoteInfo.id,
                note: note !=  null ? note.trim() : ''
            }
            //console.log('cancel quote', cancel)
            const formData = new FormData();
            formData.append('cancel', JSON.stringify(cancel));
            


            let response = await cancel_quote(formData, 'Quote ID ' + quoteInfo.id);

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

const QuoteCancel = ({ quote, onClose }) => {
    return (
        <CustomForm quoteInfo={quote}  onClose={onClose} />
    );
};

export default QuoteCancel;

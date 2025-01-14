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
import { get_account_list, get_staff_list } from "../../../api/main/accounts/Account_api";
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
import { QuotePageContext } from "../Quote_Page";
import { assign_quote } from "../../../api/main/orders/Quote_api";



const CustomForm = ({ quoteInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(QuotePageContext);

    const [loading, setLoading] = useState(true);

    const [quote, setQuote] = useState(null)

    const [saleStaffs, setSaleStaffs] = useState(null)
    const [designStaffs, setDesignStaffs] = useState(null)
    const [productionStaffs, setProductionStaffs] = useState(null)

    const [note, setNote] = useState('');

    const [assignedSaleStaff, setAssignedSaleStaff] = useState(null);
    const [assignedDesignStaff, setAssignedDesignStaff] = useState(null);
    const [assignedProductionStaff, setAssignedProductionStaff] = useState(null);

    useEffect(() => {
        const setAttribute = async () => {


            setQuote(quoteInfo)
            setNote(quoteInfo.note)


            const staffList = await get_staff_list();
            const sale_staff_list=staffList.data.sale_staff_list;
            const design_staff_list=staffList.data.design_staff_list;
            const production_staff_list=staffList.data.production_staff_list;

            setSaleStaffs(sale_staff_list);
            setDesignStaffs(design_staff_list);
            setProductionStaffs(production_staff_list);


            setAssignedSaleStaff(quoteInfo.saleStaff_id != null ? sale_staff_list.filter(staff => staff.id == quoteInfo.saleStaff_id)[0] : null);
            setAssignedDesignStaff(quoteInfo.designStaff_id != null ? design_staff_list.filter(staff => staff.id == quoteInfo.designStaff_id)[0] : null);
            setAssignedProductionStaff(quoteInfo.productionStaff_id != null ? production_staff_list.filter(staff => staff.id == quoteInfo.productionStaff_id)[0] : null);
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

            const assigned_information = {
                quote_id: quote.id,
                saleStaff_id: assignedSaleStaff.id,
                designStaff_id: assignedDesignStaff.id,
                productionStaff_id: assignedProductionStaff.id,
                note: note !=  null ? note.trim() : ''
            }
            //console.log('assigned_information', assigned_information)
            const formData = new FormData();
            formData.append('assigned_information', JSON.stringify(assigned_information));


            let response = await assign_quote(formData, 'Quote ID ' + quote.id);

            if (response.success) {
                handleDataChange();
                onClose();
            }
            dispatch(setToast(response.mess))


            
        }

    }
    const handleAssign = (selectedStaff, role_id) => {
        if (role_id == 2) {
            setAssignedSaleStaff(selectedStaff)
        } else if (role_id == 3) {
            setAssignedDesignStaff(selectedStaff)
        } else if (role_id == 4) {
            setAssignedProductionStaff(selectedStaff)
        }

    }

    return (
        <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
        >
            <CCol md={6}>
                <AccountCard account={quoteInfo.account} avatarSize={130} cardHeight={'100%'} />
            </CCol>
            <CCol md={6}>
                <QuoteDetailCard quote={quoteInfo} />
            </CCol>
            <CCol md={12}>
                <NoteCard minRows={10} maxRows={30} isLoading={loading} note={note} handleChange={handleNote} />
            </CCol>
            <CCol md={12}>
                <CRow>
                    <CCol md={4}>
                        <span ><b>Sale Staff: </b></span>
                        {loading ?
                            <CButton color="light w-100" disabled>
                                <CSpinner as="span" size="sm" aria-hidden="true" />
                                Loading...
                            </CButton>
                            :
                            <AssignCard selection={assignedSaleStaff} staffList={saleStaffs} handleAssign={handleAssign} />

                        }
                    </CCol>
                    <CCol md={4}>
                        <span><b>Design Staff: </b></span>
                        {loading ?
                            <CButton color="light w-100" disabled>
                                <CSpinner as="span" size="sm" aria-hidden="true" />
                                Loading...
                            </CButton>
                            :
                            <AssignCard selection={assignedDesignStaff} staffList={designStaffs} handleAssign={handleAssign} />
                        }
                    </CCol>
                    <CCol md={4}>
                        <span><b>Production Staff: </b></span>
                        {loading ?
                            <CButton color="light w-100" disabled>
                                <CSpinner as="span" size="sm" aria-hidden="true" />
                                Loading...
                            </CButton>
                            :
                            <AssignCard selection={assignedProductionStaff} staffList={productionStaffs} handleAssign={handleAssign} />
                        }
                    </CCol>
                </CRow>
            </CCol>
            <CCol xs={12} className="d-flex justify-content-center">
                <CButton color="success" type="submit" disabled={!assignedSaleStaff || !assignedDesignStaff || !assignedProductionStaff} >
                    Confirm this assignment
                </CButton>
            </CCol>
        </CForm>
    )
}

const AssignForm = ({ quote, onClose }) => {
    return (
        <CustomForm quoteInfo={quote} onClose={onClose} />
    );
};

export default AssignForm;

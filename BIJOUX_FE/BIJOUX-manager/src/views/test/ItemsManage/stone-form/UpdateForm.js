import React, { useContext, useEffect, useState, useRef } from "react";

import { faker } from "@faker-js/faker";
import { Link } from "react-router-dom";
import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
} from '@coreui/react'
import { ItemsManageContext } from "..";
import { StoneShapeContext } from "../StoneShape/table";
import { toastFormat } from "../../../component_items/toast/toast";
import { add_stoneShape_list, update_stoneShape_list } from "../../../../api/StoneApi";
//import { set } from "core-js/core/dict";
const status = ["warning", "danger", "success", "secondary"];

const tag = ["primary", "secondary", "info"];

const CustomStyles = ({ shape, onClose }) => {
    
    const [validated, setValidated] = useState(false)
    const [disabled, setDisabled] = useState(false);

    const update_id = useRef();
    const update_name = useRef();
    const update_path = useRef();


    const { onDataChange } = useContext(StoneShapeContext);
    const { setToast } = useContext(ItemsManageContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        setDisabled(true);
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else if (form.checkValidity() === true) {

            const new_shape = {
                id: update_id.current.value,
                name: update_name.current.value,
                path: update_path.current.value
            }
            //console.log("updating stone shape", new_shape)

            const formData = new FormData();

            formData.append('new_shape', JSON.stringify(new_shape));
            let response = await update_stoneShape_list(formData);

            let mess = '';
            let mess_color = '';
            if (response.success) {
                mess = response.success;
                onDataChange();
                setValidated(false);
                onClose();
                mess_color = 'success'
            } else if (response.error) {
                mess = response.error;
                mess_color = 'danger'
            }
            


            setToast(toastFormat({ color: mess_color, title: 'Stone Shape id ' + update_id.current.value, mess: mess }))

        }

        setDisabled(false)
    }
    return (
        <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom01">Shape name</CFormLabel>
                <CFormInput type="text" id="validationCustom01" defaultValue={shape.id} ref={update_id} disabled />
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom01">Shape name</CFormLabel>
                <CFormInput type="text" id="validationCustom01" defaultValue={shape.name} ref={update_name} required />
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom01">Shape path</CFormLabel>
                <CFormInput type="text" id="validationCustom01" defaultValue={shape.path} ref={update_path} required />
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol xs={12} >
                <CButton color="primary" type="submit" disabled={disabled}>
                    Confirm update
                </CButton>
            </CCol>
        </CForm>
    )
}

const UpdateForm = (props) => {


    return (

        <CustomStyles shape={props.shape} onClose={props.onClose} />
    )

};

export default UpdateForm;

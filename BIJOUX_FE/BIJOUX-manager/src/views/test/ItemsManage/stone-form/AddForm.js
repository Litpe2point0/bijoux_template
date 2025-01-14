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
import { add_stoneShape_list } from "../../../../api/StoneApi";


const CustomStyles = ({onClose}) => {

  const [validated, setValidated] = useState(false)
  const [disabled, setDisabled] = useState(false);
  
  
  const add_name = useRef();
  const add_path = useRef();
  

  const {onDataChange } = useContext(StoneShapeContext);
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
        name: add_name.current.value,
        path: add_path.current.value
      }
      //console.log("adding stone shape", new_shape)

      const formData = new FormData();
      
      formData.append('new_shape', JSON.stringify(new_shape));
      let response = await add_stoneShape_list(formData);
      
      let mess = '';
      let mess_color='';
      if (response.success) {
        mess = response.success;
        
        onClose();
        onDataChange();
        setValidated(false);
        
        mess_color='success'
      } else if (response.error) {
        mess = response.error;
        mess_color='danger'
      }
      let product = {
        id: response.new_shape_id,
      }


      setToast(toastFormat({color: mess_color, title: 'Stone Shape id '+product.id, mess: mess }))

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
        <CFormInput type="text" id="validationCustom01" ref={add_name} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Shape path</CFormLabel>
        <CFormInput type="text" id="validationCustom01" ref={add_path} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol xs={12} >
        <CButton color="primary" type="submit" disabled={disabled}>
          Confirm add
        </CButton>
      </CCol>
    </CForm>
  )
}

const AddForm = ({onClose}) => {


  return (

    <CustomStyles onClose={onClose}/>
  )

};

export default AddForm;

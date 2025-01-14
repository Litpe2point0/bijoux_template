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
import { MyContext } from "../ProductTable";
import { toastFormat } from "../../../component_items/toast/toast";
import { add_product_list } from "../../../../api/ProductApi";
import ImgUploadPreview from "./ImgUploadPreview";
import { useDispatch } from "react-redux";
import { setToast } from "../../../../redux/notification/toastSlice";
//import { set } from "core-js/core/dict";
const status = ["warning", "danger", "success", "secondary"];

const tag = ["primary", "secondary", "info"];

const CustomStyles = ({onClose}) => {
  const dispatch= useDispatch();
  const [validated, setValidated] = useState(false)
  const [disabled, setDisabled] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
 

  const add_name = useRef();
  const add_price = useRef();
  const add_quantity = useRef();
  

  const { onDataChange} = useContext(MyContext);

  const empty_input = () => {
    add_name.current.value = "";
    add_price.current.value = "";
    add_quantity.current.value = "";
    setImageBase64(null);
    setImageFile(null)
    
  }
  const handleFileBase64 = (base64) => {
    setImageBase64(base64)
    //console.log(base64)
  }
  const handleFileUpload = (file) => {
    setImageFile(file)
    //console.log(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);
    setDisabled(true);
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else if (form.checkValidity() === true) {
      
      const new_product = {
        name: add_name.current.value,
        price: add_price.current.value,
        quantity: add_quantity.current.value,
        image: imageBase64,
      }

      //console.log("add product", new_product)

      const formData = new FormData();
      formData.append('imageFile', imageFile);
      formData.append('new_product', JSON.stringify(new_product));
      let response = await add_product_list(formData);
      //let response = await add_product_list(JSON.stringify(new_product),imageFile);
      let mess = '';
      let mess_color='';

      if (response.success) {
        mess = response.success
        onDataChange();
        //empty_input()
        onClose()
        setValidated(false)
        mess_color='success'
      } else if (response.error) {
        mess = response.error;
        mess_color='danger'
      }
      let product = {
        id: response.new_product_id,

      }

      
      //setToast(toastFormat({color: mess_color,title: 'Product id '+product.id, mess: mess }))
      dispatch(setToast({ color: mess_color,title: 'Product id '+product.id, mess: mess }))

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
        <CFormLabel htmlFor="validationCustom01">Product name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" ref={add_name} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Product price</CFormLabel>
        <CFormInput type="text" id="validationCustom02" ref={add_price} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Product quantity</CFormLabel>
        <CFormInput type="number" id="validationCustom02" ref={add_quantity} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Product Image</CFormLabel>
        <ImgUploadPreview handleFileUpload={handleFileUpload} handleFileBase64={handleFileBase64}/>
      </CCol>
      <CCol xs={12} >
        <CButton color="primary" type="submit" disabled={disabled}>
          Confirm add
        </CButton>
      </CCol>
    </CForm>
  )
}

const AddFormInside = ({ onClose }) => {
  return (
    <CustomStyles onClose={onClose} />
  );
};

export default AddFormInside;

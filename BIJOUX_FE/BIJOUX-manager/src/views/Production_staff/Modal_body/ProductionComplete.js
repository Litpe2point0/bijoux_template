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
} from '@coreui/react'
import { get_account_list } from "../../../api/main/accounts/Account_api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { clearToast, setToast } from "../../../redux/notification/toastSlice";
import { useNavigate } from "react-router-dom";
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { ProductionStatusContext } from "../Quote widget/OrderDetail";
import UploadSingle from "../Quote widget/UploadSingle";
import { production_complete } from "../../../api/main/orders/Order_api";





const CustomForm = ({ currentProductionProcess, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { order, handleDataChange } = useContext(ProductionStatusContext)

    const [loading, setLoading] = useState(true);


    //report
    //const [imageBase64, setImageBase64] = useState(false);
    const [status, setStatus] = useState(currentProductionProcess.production_status);



    useEffect(() => {
        const setAttribute = async () => {

            

            setLoading(false);
        }
        
        setAttribute()
    }, [])


    const handleSubmit = async () => {
        setLoading(true);
        const order_id=order.id 

        //console.log('order_id',order_id)
        const formData = new FormData();
        formData.append('order_id', JSON.stringify(order_id));

        const response = await production_complete(formData,"Order ID "+order_id);
        dispatch(setToast(response.mess))
        setLoading(false);
        if(response.success){
            handleDataChange()
            onClose();
        }

        
    }

    return (
        <>
            {loading
                ?
                <CButton color="light w-100" disabled>
                    <CSpinner as="span" size="sm" aria-hidden="true" />
                    Loading...
                </CButton>
                :
                <CForm
                    className="row g-3 needs-validation d-flex justify-content-center"
                >   
                    
                    <div className="mt-2">
                    This action will turn order into payment status

                    </div>
                    <UploadSingle defaultImage={currentProductionProcess.imageUrl} disabled={true} />

                    <CButton color="success w-100" onClick={() => handleSubmit()}  >
                        Confirm to complete
                    </CButton>
                </CForm>
            }
        </>

    )
}

const ProductionComplete = ({ currentProductionProcess, onClose }) => {
    return (
        <CustomForm currentProductionProcess={currentProductionProcess} onClose={onClose} />
    );
};

export default ProductionComplete;

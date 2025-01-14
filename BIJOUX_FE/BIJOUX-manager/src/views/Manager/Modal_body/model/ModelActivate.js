import React, { useContext, useEffect, useState, useRef } from "react";

import {
    CButton,
    CCol,
    CForm,
    CFormLabel,
    CRow,
    CSpinner
} from '@coreui/react'
import { get_account_list } from "../../../../api/main/accounts/Account_api";
import { useDispatch } from "react-redux";
import { setToast } from "../../../../redux/notification/toastSlice";
import { set_deactivate_model } from "../../../../api/main/items/Model_api";



const CustomForm = ({ modelInfo, activate, onClose }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);




    const handleSubmit = async (event) => {
        const controller = new AbortController();
        const signal = controller.signal;

        setLoading(true);
        event.preventDefault();

        const model_id = modelInfo.id;
        const deactivate = {
            model_id: model_id,
            deactivate: !activate
        }
        //console.log('deactivate', deactivate)
        const formData = new FormData();
        formData.append('deactivate', JSON.stringify(deactivate));
        
        let response = await set_deactivate_model(formData, 'Model ID ' + modelInfo.id);

        if (response.success) {
            
            onClose(activate);
        }
        dispatch(setToast(response.mess))
        
        
        
        // await get_account_list({signal});
        // await get_account_list({signal});
        // await get_account_list({signal});
        // await get_account_list({signal});
        // await get_account_list({signal});
        // await get_account_list({signal});
        //dispatch(setToast({ color: 'success', title: 'Model id ' + modelInfo.id, mess: (activate ? "Activate" : "Deactivate") + " successfully !" }))

        //onClose(activate);   // đây là kết quả quyết định là activate thành công hay không , nếu không thì switch sẽ về trạng thái cũ   (activate=!activate)

    }


    return (
        <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
        >
            <CFormLabel htmlFor="note" className="form-label">            {activate ? 'This action will available the item into main page' : 'This action will unavailable the item from main page'}
            </CFormLabel>
            <CCol xs={12} className="d-flex justify-content-center">
                <CButton color="danger" type="submit" disabled={loading} >
                    Sure to {activate ? "Activate" : "Deactivate"}
                </CButton>
            </CCol>

        </CForm>
    )
}

const ModelActivate = ({ model, activate, onClose }) => {
    return (
        <CustomForm modelInfo={model} activate={activate} onClose={onClose} />
    );
};

export default ModelActivate;

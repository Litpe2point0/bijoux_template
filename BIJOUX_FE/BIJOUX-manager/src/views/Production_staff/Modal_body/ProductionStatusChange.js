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
import { add_production_process, get_production_status_list } from "../../../api/main/orders/Order_api";





const CustomForm = ({ currentProductionStatus, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { order, handleDataChange } = useContext(ProductionStatusContext)

    const [loading, setLoading] = useState(true);

    const [productionStatusList, setProductionStatusList] = useState(null)

    //report
    const [imageBase64, setImageBase64] = useState(false);
    const [status, setStatus] = useState(currentProductionStatus);



    useEffect(() => {
        const setAttribute = async () => {

            const production_status_list_data = await get_production_status_list();

            const production_status_list = production_status_list_data.data
            setProductionStatusList(production_status_list)

            setLoading(false);
        }
        setAttribute()
    }, [])
    const handleStatusSelect = (e, newValue) => {
        setStatus(JSON.parse(newValue))
    }
    const handleImageChange = (image) => {
        setImageBase64(image)
    }

    const handleSubmit = async () => {
        setLoading(true);

        const new_production_process = {
            order_id: order.id,
            production_status_id: status.id,
            imageUrl: imageBase64,
        }

        //console.log('new_production_process', new_production_process)
        const formData = new FormData();
        formData.append('new_production_process', JSON.stringify(new_production_process));

        const response = await add_production_process(formData, 'New Production Process');
        if (response.success) {
            handleDataChange();
            onClose();
        }
        dispatch(setToast(response.mess))
        setLoading(false)


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

                    <Select
                        onChange={handleStatusSelect}
                        variant="soft"
                        className="px-1 py-0"
                        defaultValue={JSON.stringify(status)}
                        slotProps={{
                            listbox: {
                                sx: {
                                    '--ListItemDecorator-size': '44px',
                                },
                            },
                        }}
                        sx={{
                            '--ListItemDecorator-size': '44px',
                            width: '100%',
                            height: '1.5em',
                        }}
                    >
                        {productionStatusList.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <Option value={JSON.stringify(item)} label={item.name} >
                                    {item.name}
                                </Option>
                            </React.Fragment>
                        ))}
                    </Select>
                    <UploadSingle handleSingleFileBase64={handleImageChange} defaultImage={imageBase64} disabled={false} />
                    <CButton color="success w-100" onClick={() => handleSubmit()}  >
                        Confirm
                    </CButton>
                </CForm>
            }
        </>

    )
}

const ProductionStatusChange = ({ currentProductionStatus, onClose }) => {
    return (
        <CustomForm currentProductionStatus={currentProductionStatus} onClose={onClose} />
    );
};

export default ProductionStatusChange;

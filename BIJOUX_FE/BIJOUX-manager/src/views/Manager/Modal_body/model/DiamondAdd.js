import React, { useContext, useEffect, useState, useRef } from "react";

import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CFormCheck,
    CSpinner,
    CFormSelect
} from '@coreui/react'
import { useDispatch } from "react-redux";
import { Avatar, Button, ListItemAvatar, ListItemText } from "@mui/material";
import { Coins } from "phosphor-react";
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { get_account_list } from "../../../../api/main/accounts/Account_api";
import { get_shape_list, get_size_list } from "../../../../api/main/items/Diamond_api";
import { setToast } from "../../../../redux/notification/toastSlice";





function renderValue(item) {
    if (!item) {
        return null;
    }
    //console.log('item', item)
    const shape = JSON.parse(item.value);

    return (
        <>
            <ListItemDecorator>
                <svg fill='none' viewBox="0 0 18 18" style={{ width: 'fit-content' }} height="28" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={shape.drawing_path} />
                </svg>
            </ListItemDecorator>
            {shape.name}
        </>
    );
}

const CustomForm = ({ handleAddDiamond, onClose }) => {
    const dispatch = useDispatch();
    const [validated, setValidated] = useState(false)
    const [loading, setLoading] = useState(true)

    const [isSearch, setIsSearch] = useState(false)


    const [shapeList, setShapeList] = useState([]);

    const [addShape, setAddShape] = useState(null);
    const [sizeList, setSizeList] = useState([]);
    const [minSize, setMinSize] = useState(1);
    const [maxSize, setMaxSize] = useState(1);
    const [count, setCount] = useState(1);
    const [isEditable, setIsEditable] = useState(false);


    useEffect(() => {


        const setAttribute = async () => {

            const shape_list = await get_shape_list();
            const size_list = await get_size_list();

            setShapeList(shape_list.data)
            setSizeList(size_list.data)
            setAddShape(shape_list.data[0])


            setLoading(false)
        }
        setAttribute()


    }, [])


    useEffect(() => {
        //console.log('addShape', addShape)
        //console.log('minSize', minSize)
        //console.log('maxSize', maxSize)

        //console.log('count', count)
        //console.log('isEditable', isEditable)
    }, [addShape, minSize, maxSize, count, isEditable])


    const handleShapeSelect = (event, newValue) => {
        const selectedItem = JSON.parse(newValue);
        setAddShape(selectedItem);
    };


    const handleCount = (event) => {
        setCount(event.target.value)
    }
    const handleMinSize = (event) => {
        //console.log('min size', parseFloat(event.target.value))
        setMinSize(parseFloat(event.target.value))
    }
    const handleMaxSize = (event) => {
        //console.log('max size', parseFloat(event.target.value))
        setMaxSize(parseFloat(event.target.value))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else if (form.checkValidity() === true) {
            const add_diamond = {
                diamond_size_min: minSize,
                diamond_size_max: maxSize,
                diamond_shape: addShape,
                count: count,
                is_editable: isEditable ? 1 : 0
            }

            //console.log('add diamond', add_diamond)
            if(maxSize < minSize){
                return dispatch(setToast({ color: 'danger',title: 'Add Failed', mess: "max size must be greater than min size" }))
            }
            handleAddDiamond(add_diamond)
            onClose();
        }

    }


    return (
        <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}

        >
            <CCol md={12} >
                <CFormLabel htmlFor="validationCustom01">Shape</CFormLabel>
                {loading
                    ?
                    <CButton color="light w-100" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton>
                    :
                    <Select
                        onChange={handleShapeSelect}
                        variant="soft"
                        className="px-1 py-0"
                        defaultValue={JSON.stringify(addShape)}
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
                        renderValue={renderValue}
                    >
                        {shapeList.map((item, index) => (
                            <React.Fragment key={item.id} >
                                <Option value={JSON.stringify(item)} label={item.name}  >
                                    <ListItemDecorator>
                                        <svg fill='none' viewBox="0 0 18 18" style={{ width: 'fit-content' }} height="28" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={item.drawing_path} />
                                        </svg>
                                    </ListItemDecorator>
                                    {item.name}
                                </Option>
                            </React.Fragment>
                        ))}
                    </Select>
                }

                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom02">Min Size</CFormLabel>
                {/* <CFormInput type="number" min={0} id="validationCustom02" onChange={handleMinSize} defaultValue={minSize} required /> */}
                {loading
                    ?
                    <CButton color="light w-100" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton>
                    :
                    <CFormSelect aria-label="Default select example" onChange={(e) => handleMinSize(e)}>
                        {sizeList.map((size, index) => (
                            <option key={index} value={size} >{size}</option>
                        ))}
                    </CFormSelect>
                }

                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom02">Max Size</CFormLabel>
                {/* <CFormInput type="number" min={0} id="validationCustom02" onChange={handleMaxSize} defaultValue={maxSize} required /> */}
                {loading
                    ?
                    <CButton color="light w-100" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton>
                    :
                    <CFormSelect aria-label="Default select example" onChange={(e) => handleMaxSize(e)}>
                        {sizeList.map((size, index) => (
                            <option key={index} value={size} >{size}</option>
                        ))}
                    </CFormSelect>
                }
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom02">Count</CFormLabel>
                <CFormInput type="number" min={1} step={1} id="validationCustom02" onChange={handleCount} defaultValue={count} required />
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={12} className="border border-light rounded w-25 p-1">

                <CFormCheck id="flexCheckDefault" label="Is Editable " defaultChecked={isEditable} onChange={e => setIsEditable(e.target.checked)} />
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>



            <CCol xs={12} className="d-flex justify-content-center">
                <CButton disabled={loading} color="success" type="submit" >
                    Confirm add
                </CButton>
            </CCol>
        </CForm>
    )
}

const DiamondAdd = ({ handleAddDiamond, onClose }) => {
    return (
        <CustomForm handleAddDiamond={handleAddDiamond} onClose={onClose} />
    );
};

export default DiamondAdd;

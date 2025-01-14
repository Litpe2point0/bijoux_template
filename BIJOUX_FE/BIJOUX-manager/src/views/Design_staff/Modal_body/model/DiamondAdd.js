import React, { useContext, useEffect, useState, useRef } from "react";

import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CFormCheck,
    CSpinner
} from '@coreui/react'
import { get_account_list } from "../../../../api/main/accounts/Account_api";
import AvatarUpload from "../../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../../redux/notification/toastSlice";
import Checkbox, { checkboxClasses } from '@mui/joy/Checkbox';
import Sheet from '@mui/joy/Sheet';
import { Avatar, Button, ListItemAvatar, ListItemText } from "@mui/material";
import { Coins } from "phosphor-react";
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { get_diamond_imageUrl } from "../../../../api/Back_End_Url";
import { get_clarity_list, get_color_list, get_cut_list, get_diamond_list, get_origin_list, get_shape_list, get_size_list } from "../../../../api/main/items/Diamond_api";
import { CurrencyFormatterText } from "../../../component_items/Ag-grid/money_formatter";



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

    const [searchedDiamond, setSearchedDiamond] = useState(null);  

    const [shapeList, setShapeList] = useState([]);
    const [colorList, setColorList] = useState([]);
    const [originList, setOriginList] = useState([]);
    const [clarityList, setClarityList] = useState([]);
    const [cutList, setCutList] = useState([]);
    const [sizeList, seSizeList] = useState([]);

    const [addShape, setAddShape] = useState(null);
    const [addColor, setAddColor] = useState(null);
    const [addOrigin, setAddOrigin] = useState(null);
    const [addClarity, setAddClarity] = useState(null);
    const [addCut, setAddCut] = useState(null);
    const [addSize, setAddSize] = useState(null);
    const [count, setCount] = useState(1);


    useEffect(() => {


        const setAttribute = async () => {

            const shape_list= await get_shape_list();
            const color_list= await get_color_list();
            const origin_list= await get_origin_list();
            const clarity_list= await get_clarity_list();
            const cut_list= await get_cut_list();
            const size_list= await get_size_list();


            setShapeList(shape_list.data)
            setColorList(color_list.data)
            setOriginList(origin_list.data)
            setClarityList(clarity_list.data)
            setCutList(cut_list.data)
            seSizeList(size_list.data)
            setAddShape(shape_list.data[0])
            setAddColor(1)
            setAddOrigin(origin_list.data[0])
            setAddClarity(1)
            setAddCut(1)
            setAddSize(size_list.data[0])


            setLoading(false)
        }
        setAttribute()


    }, [])


    useEffect(() => {
        //console.log('addShape', addShape)
        //console.log('addColor', addColor)
        //console.log('addOrigin', addOrigin)
        //console.log('addClarity', addClarity)
        //console.log('addCut', addCut)
        //console.log('addSize', addSize)
        //console.log('count', count)
    }, [addShape, addColor, addOrigin, addClarity, addSize, count])


    const handleShapeSelect = (event, newValue) => {
        //console.log('event 111111', newValue)
        const selectedItem = JSON.parse(newValue);
        setAddShape(selectedItem);

        setIsSearch(false)
    };

    const handleOriginSelect = (event, newValue) => {
        //console.log('event 22222', event)

        const selectedItem = JSON.parse(newValue);
        setAddOrigin(selectedItem);
        setIsSearch(false)
    };
    const handleColor = (event, newValue) => {
        setAddColor(newValue);
        setIsSearch(false)
    };
    const handleClarity = (event, newValue) => {
        setAddClarity(newValue)
        setIsSearch(false)
    }
    const handleCut = (event, newValue) => {
        setAddCut(newValue)
        setIsSearch(false)
    }
    const handleSize = (event, newValue) => {
        setAddSize(newValue)
        setIsSearch(false)
    }
    const handleCount = (event) => {
        const value = event.target.value;

        setCount(value > 0 ? value : 0)
        setIsSearch(false)
    }
    const handleSearch = () => {

        const setResult = async () => {
            //await get_account_list();
            const diamond_search_information = {
                size: addSize,
                diamond_color_id: addColor,
                diamond_origin_id: addOrigin.id,
                diamond_clarity_id: addClarity,
                diamond_cut_id: addCut
            }
            //console.log('diamond_search_information', diamond_search_information)

            const formData = new FormData();
            formData.append('diamond_search_information', JSON.stringify(diamond_search_information) );

            let diamond_search =await get_diamond_list(formData, 'Searching Diamond');
            
            if (diamond_search.success && diamond_search.data.length > 0) {
                //console.log('diamond_search', diamond_search.data[0])
                setSearchedDiamond(diamond_search.data[0]);
                setIsSearch(true)
                
            } else {
                dispatch(setToast(diamond_search.mess))
                setSearchedDiamond(null)
                setIsSearch(false)
            }
            
        }
        setResult()
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else if (form.checkValidity() === true) {
            const add_diamond = {
                diamond: searchedDiamond,
                diamond_shape: addShape,
                count: count,
                price: searchedDiamond.price * count
            }
            handleAddDiamond(add_diamond)
            onClose();
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
            <CCol md={6} >
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
            <CCol md={6} >
                <CFormLabel htmlFor="validationCustom01">Origin</CFormLabel>
                {loading
                    ?
                    <CButton color="light w-100" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton>
                    :
                    <Select
                        onChange={handleOriginSelect}
                        variant="soft"
                        className="px-1 py-0"
                        defaultValue={JSON.stringify(addOrigin)}
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
                        {originList.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <Option value={JSON.stringify(item)} label={item.name} >
                                    {item.name}
                                </Option>
                            </React.Fragment>
                        ))}
                    </Select>
                }
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={6} >
                <CFormLabel htmlFor="validationCustom01">Color</CFormLabel>
                {loading
                    ?
                    <CButton color="light w-100" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton>
                    :
                    <Select
                        onChange={handleColor}
                        variant="soft"
                        className="px-1 py-0"
                        defaultValue={addColor}
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
                        {colorList.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <Option value={item.id} label={item.name} >
                                    {item.name}
                                </Option>
                            </React.Fragment>
                        ))}
                    </Select>
                }
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={6} >
                <CFormLabel htmlFor="validationCustom01">Clarity</CFormLabel>
                {loading
                    ?
                    <CButton color="light w-100" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton>
                    :
                    <Select
                        onChange={handleClarity}
                        variant="soft"
                        className="px-1 py-0"
                        defaultValue={addClarity}
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
                        {clarityList.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <Option value={item.id} label={item.name} >
                                    {item.name}
                                </Option>
                            </React.Fragment>
                        ))}
                    </Select>
                }
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={6} >
                <CFormLabel htmlFor="validationCustom01">Size</CFormLabel>
                {loading
                    ?
                    <CButton color="light w-100" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton>
                    :
                    <Select
                        onChange={handleSize}
                        variant="soft"
                        className="px-1 py-0"
                        defaultValue={addSize}
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
                        {sizeList.map((item, index) => (
                            <React.Fragment key={item}>
                                <Option value={item} label={item} >
                                    {item}
                                </Option>
                            </React.Fragment>
                        ))}
                    </Select>
                }
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={6}>
                <CFormLabel htmlFor="validationCustom02">Cut</CFormLabel>
                {loading
                    ?
                    <CButton color="light w-100" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton>
                    :
                    <Select
                        onChange={handleCut}
                        variant="soft"
                        className="px-1 py-0"
                        defaultValue={addCut}
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
                        {cutList.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <Option value={item.id} label={item.name} >
                                    {item.name}
                                </Option>
                            </React.Fragment>
                        ))}
                    </Select>
                }                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom02">Count</CFormLabel>
                <CFormInput type="number" min={1} step={1} id="validationCustom02" onChange={handleCount} defaultValue={1} required />
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>


            <CCol md={12} className="d-flex justify-content-center">

                <Button
                    onClick={() => {
                        handleSearch();
                    }}
                    className="rounded-pill fw-bold"
                    variant="outlined"
                    color="warning"
                    startIcon={<Coins size={25} color="peru" weight="duotone" />}
                    disabled={count == 0 || !count}
                >
                    Price Calculating
                </Button>
            </CCol>
            <hr />
            <CCol md={12} className="d-flex justify-content-center">
                {searchedDiamond && <img width={'50%'} src={searchedDiamond?.imageUrl} alt="metal" />}

            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom02">Diamond ID</CFormLabel>

                <CFormInput disabled type="number" id="validationCustom02" value={searchedDiamond?.id} required />

                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom02">Price In One</CFormLabel>

                <CFormInput disabled  id="validationCustom02" value={searchedDiamond? CurrencyFormatterText(searchedDiamond.price):''} required />

                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom02">Price In Total</CFormLabel>

                <CFormInput disabled  id="validationCustom02" value={searchedDiamond ? CurrencyFormatterText(searchedDiamond.price * count):''} required />

                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol xs={12} className="d-flex justify-content-center">
                <CButton onClick={handleSubmit} color="success" type="submit" disabled={!isSearch}>
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

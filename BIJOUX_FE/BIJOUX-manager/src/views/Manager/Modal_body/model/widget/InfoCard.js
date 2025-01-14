import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardImage,
    CCardTitle,
    CCardText,
    CModal,
    CModalBody,
    CModalHeader,
    CSpinner,
    CRow,
    CCol,
    CCardHeader,
    CFormInput,
    CInputGroupText,
    CInputGroup,
    CFormSelect,
    CFormTextarea,
} from '@coreui/react'
import { ArrowCircleDown, ArrowCircleUp, CurrencyCircleDollar, Eye, Pencil, PlusCircle, UserCirclePlus } from "phosphor-react";
import { Button, ButtonGroup, FormControl, FormControlLabel, FormGroup, IconButton, Checkbox, ListItemAvatar, Avatar } from "@mui/material";
import { get_account_list } from "../../../../../api/main/accounts/Account_api";
import RadioGroup from "@mui/joy/RadioGroup";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Radio from "@mui/joy/Radio";
import { get_mounting_style_list } from "../../../../../api/main/items/Model_api";
import { get_shape_list } from "../../../../../api/main/items/Diamond_api";
export const Staff_Page_Context = createContext();



const InfoCard = ({ mounting_type, model, handleChange }) => {
    const [loading, setLoading] = useState(true)
    const [styleList, setStyleList] = useState([])
    const [shapeList, setShapeList] = useState([])

    const [name, setName] = useState(model ? model.name : "New Model")
    const [baseWidth, setBaseWidth] = useState(model && model.base_width ? model.base_width : 0)
    const [baseHeight, setBaseHeight] = useState(model && model.base_height ? model.base_height : 0)
    const [volume, setVolume] = useState(model && model.volume ? model.volume : 0)
    const [availableStyle, setAvailableStyle] = useState(null)
    const [availableShapes, setAvailableShapes] = useState([])

    useEffect(() => {
        const setAttribute = async () => {
            const style_list = await get_mounting_style_list();
            setStyleList(style_list.data);

            const shape_list = await get_shape_list();
            setShapeList(shape_list.data);




            setAvailableStyle(model ? model.mounting_style : style_list.data[0])
            setAvailableShapes(model ? model.model_diamond_shape.map(item => item.id) : [])
            //console.log("SHAPE LISTTTTT",model.model_diamond_shape)
            setLoading(false)
        }
        setAttribute()

    }, [])
    useEffect(() => {
        //console.log("SHAPE LIST NÈ", availableShapes)
    }, [availableShapes])

    const handleStyleSelect = (event) => {
        const selectedItem = JSON.parse(event.target.value);
        setAvailableStyle(selectedItem);
    };
    const handleAvailableShape = (event) => {
        const { value, checked } = event.target;
        const intValue = parseInt(value, 10);

        setAvailableShapes((prev) => {
            if (checked) {
                return [...prev, intValue].filter((item, index, self) => self.indexOf(item) === index);
            } else {
                return prev.filter((item) => item !== intValue);
            }
        });
    };


    useEffect(() => {

        const info = {
            name: name.trim(),
            baseWidth: baseWidth == 0 || isNaN(baseWidth) ? null : parseFloat(baseWidth),
            baseHeight: baseHeight == 0 || isNaN(baseHeight) ? null : parseFloat(baseHeight),
            volume: volume == 0 || isNaN(volume) ? null : parseFloat(volume),
            availableStyle: availableStyle,
            availableShape: availableShapes
        }

        handleChange(info)
    }, [name, baseWidth, baseHeight, volume, availableStyle, availableShapes])
    return (
        <CCard className="bg-light metal-card" >
            <CCardHeader   >
                <CRow>
                    <CCol md={2} className="text-dark fw-bold fs-5 d-flex align-items-center">Main Info</CCol>
                </CRow>
            </CCardHeader>
            <CCardBody>

                <CRow className="w-100 my-2">
                    <CCol sm={6} md={6} lg={6}>
                        <span className="text-dark" >Name: </span>
                    </CCol>
                    <CCol sm={6} md={6} lg={6}>
                        <CInputGroup >
                            <CFormInput type="text" className="h-50 quote-detail-card" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                            <CInputGroupText className="px-1 py-0">
                                <Pencil size={15} color="white" weight="duotone" />
                            </CInputGroupText>
                        </CInputGroup>
                    </CCol>
                </CRow>
                <CRow className="w-100 my-2">
                    <CCol sm={6} md={6} lg={6}>
                        <span className="text-dark" >Base Width: </span>
                    </CCol>
                    <CCol sm={6} md={6} lg={6}>
                        <CInputGroup >
                            <CFormInput type="number" min={0} className="h-50 quote-detail-card" defaultValue={baseWidth} onChange={(e) => setBaseWidth(parseFloat(e.target.value) > 0 ? parseFloat(e.target.value) : 0)} />
                            <CInputGroupText className="px-1 py-0">
                                <Pencil size={15} color="white" weight="duotone" />
                            </CInputGroupText>
                        </CInputGroup>
                    </CCol>
                </CRow>
                <CRow className="w-100 my-2">
                    <CCol sm={6} md={6} lg={6}>
                        <span className="text-dark" >Base Height: </span>
                    </CCol>
                    <CCol sm={6} md={6} lg={6}>
                        <CInputGroup >
                            <CFormInput type="number" min={0} className="h-50 quote-detail-card" defaultValue={baseHeight} onChange={(e) => setBaseHeight(parseFloat(e.target.value) > 0 ? parseFloat(e.target.value) : 0)} />
                            <CInputGroupText className="px-1 py-0">
                                <Pencil size={15} color="white" weight="duotone" />
                            </CInputGroupText>
                        </CInputGroup>
                    </CCol>
                </CRow>
                <CRow className="w-100 my-2">
                    <CCol sm={6} md={6} lg={6}>
                        <span className="text-dark" >Volume: </span>
                    </CCol>
                    <CCol sm={6} md={6} lg={6}>
                        <CInputGroup >
                            <CFormInput disabled={mounting_type ? mounting_type.id != 3 : model.mounting_type.id != 3} type="number" min={0} className="h-50 quote-detail-card" defaultValue={volume} onChange={(e) => setVolume(parseFloat(e.target.value) > 0 ? parseFloat(e.target.value) : 0)} />
                            <CInputGroupText className="px-1 py-0">
                                <Pencil size={15} color="white" weight="duotone" />
                            </CInputGroupText>
                        </CInputGroup>
                    </CCol>
                </CRow>
                <CRow className="w-100 my-2">
                    <CCol sm={12} md={12} lg={6} >
                        <span className="text-dark">Style: </span>
                    </CCol>
                    <CCol sm={12} md={12} lg={6} >

                        <RadioGroup className="p-0" aria-label="Your plan" name="people" defaultValue={JSON.stringify(availableStyle)} onChange={handleStyleSelect}  >
                            {loading ?
                                <List
                                    sx={{
                                        minWidth: 240,
                                        '--List-gap': '0.5rem',
                                        '--ListItem-paddingY': '1rem',
                                        '--ListItem-radius': '8px',
                                        '--ListItemDecorator-size': '32px',
                                    }}
                                >
                                    <ListItem variant="outlined" sx={{ boxShadow: 'sm', height: '3em' }}><CSpinner color="primary" /></ListItem>
                                </List>
                                :


                                <List
                                    sx={{
                                        minWidth: 240,
                                        '--List-gap': '0.5rem',
                                        '--ListItem-paddingY': '1rem',
                                        '--ListItem-radius': '8px',
                                        '--ListItemDecorator-size': '32px',
                                    }}
                                >

                                    {styleList && styleList.map((item, index) => (
                                        <ListItem variant="outlined" key={item} sx={{ boxShadow: 'sm', height: '3em' }}>
                                            <div className="w-25 h-100 d-flex align-items-center justify-content-center">
                                                <img height={'100%'} src={item.imageUrl} alt="metal" />
                                            </div>


                                            <Radio
                                                overlay
                                                checked={availableStyle && availableStyle.id === item.id}
                                                value={JSON.stringify(item)}
                                                label={item.name}
                                                sx={{ flexGrow: 1, flexDirection: 'row-reverse', color: 'text.dark' }}
                                                slotProps={{
                                                    action: ({ checked }) => ({
                                                        sx: (theme) => ({
                                                            ...(checked && {
                                                                inset: -1,
                                                                border: '2px solid',
                                                                borderColor: theme.vars.palette.primary[500],
                                                            }),
                                                        }),
                                                    }),
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            }
                        </RadioGroup>
                    </CCol>
                </CRow>
                <CRow className="w-100 my-2">
                    <CCol sm={6} md={6} lg={6} >
                        <span className="text-dark">Available Diamond Shape: </span>
                    </CCol>
                    <CCol sm={6} md={6} lg={6} >

                        <CInputGroup className="rounded quote-detail-card">

                            <FormControl sx={{ m: 3, marginY: 1 }} component="fieldset" variant="standard">
                                {loading ? <CSpinner color="primary" /> :
                                    <FormGroup>
                                        {shapeList.map((item, index) => {

                                            return (
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox sx={{
                                                            color: 'white',
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: 'medium',
                                                            },
                                                            '&.Mui-checked': {
                                                                color: 'red',
                                                            },
                                                        }} onChange={handleAvailableShape} defaultChecked={availableShapes && availableShapes.some(shape => shape == item.id)} value={item.id} />
                                                    }
                                                    label={<span className="bg-light rounded h-auto text-dark p-2" style={{ height: '100%', fontSize: 'small' }}>
                                                        <svg fill='none' viewBox="0 0 18 18" style={{ width: 'fit-content' }} height="20" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                stroke="#151542"
                                                                stroke-linejoin="bevel"
                                                                stroke-width="0.3"
                                                                d={item.drawing_path}
                                                            //d={'m 14.864 0 l 0.055 0.023 l 1.958 1.956 l 0.023 0.055 v 11.852 l -0.023 0.055 l -2.039 2.036 l -0.055 0.023 H 2.935 l -0.055 -0.023 l -1.957 -1.955 l -0.023 -0.056 V 2.115 l 0.023 -0.056 L 2.96 0.023 L 3.016 0 Z M 13.42 14.192 h -9.1 l -1.228 1.652 h 11.537 Z m -10.55 -1.44 L 1.1 13.976 l 1.826 1.827 l 1.24 -1.665 l -1.273 -1.27 l -0.023 -0.056 v -0.06 Z m 12.059 -0.059 v 0.065 l -0.022 0.055 l -1.33 1.328 l 1.215 1.661 l 1.907 -1.905 Z m -2.843 -0.325 h -6.41 l -1.24 1.667 h 8.87 Z m 1 -0.928 l -0.858 0.858 l 1.255 1.715 l 1.29 -1.288 v -0.138 Z m -8.373 0.038 l -1.687 1.167 v 0.135 l 1.234 1.23 l 1.274 -1.712 Z M 1.055 2.262 v 11.556 l 1.815 -1.255 V 3.496 Z m 15.688 -0.08 l -1.814 1.255 v 9.069 l 1.814 1.232 Z M 3.026 3.603 v 8.853 l 1.618 -1.119 V 4.701 Z m 11.747 -0.057 l -1.618 1.119 v 6.635 l 1.618 1.1 Z m -2.642 0.242 H 5.707 l -0.907 0.905 v 6.654 l 0.87 0.867 h 6.423 l 0.906 -0.906 V 4.655 Z M 4.316 1.985 l -1.29 1.29 v 0.138 L 4.713 4.56 l 0.859 -0.859 Z m 9.224 0.003 l -1.275 1.713 l 0.821 0.82 l 1.687 -1.166 v -0.134 Z m -0.178 -0.023 H 4.495 l 1.22 1.666 h 6.409 Z M 3.007 0.197 L 1.1 2.103 l 1.77 1.204 l 0.001 -0.064 l 0.023 -0.056 l 1.33 -1.329 Z m 11.865 0 l -1.238 1.664 l 1.273 1.272 l 0.023 0.056 v 0.058 l 1.77 -1.224 Z m -0.164 -0.04 H 3.17 l 1.21 1.652 h 9.098 Z'}
                                                            />
                                                        </svg>
                                                        {" "+item.name}</span>}

                                                />

                                            )
                                        })}
                                    </FormGroup>
                                }
                            </FormControl>
                        </CInputGroup>
                    </CCol>
                </CRow>

            </CCardBody>
        </CCard>
    )
}
export default InfoCard
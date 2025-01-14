import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";

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
    CModalTitle,
    CModalFooter,
} from '@coreui/react'
import './../style.css'
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
//import Button from '@mui/joy/Button';
import { PlusCircle, XCircle } from "phosphor-react";
import MetalAdd from "../MetalAdd";





export default function MetalCard({ model, handleChange }) {
    const [metalList, setMetalList] = useState(model ? model.model_metal :[])
    const [visible, setVisible] = useState(false)
    const handleClose = () => {
        setVisible(false);
    };
    const handleAddMetal = (newMetal) => {
        setMetalList([...metalList, newMetal])
    }
    useEffect(() => {
        //console.log('here is metal list ', metalList)
        handleChange(metalList)
    }, [metalList])
    const handleRemove = (index) => {
        //console.log('metal list', metalList)
        //console.log('index', index)
        const updatedMetalList = [...metalList];
        updatedMetalList.splice(index, 1);

        setMetalList(updatedMetalList);
    }
    return (
        <CCard className="bg-light metal-card" >
            <CCardHeader   >
                <CRow>
                    <CCol md={2} className="text-dark fw-bold fs-5 d-flex align-items-center">METAL</CCol>
                    <CCol className="d-flex align-items-center" md={10}>
                        <Button
                            onClick={() => setVisible(!visible)}
                            className="rounded-pill fw-bold"
                            variant="outlined"
                            color="warning"
                            startIcon={<PlusCircle size={25} color="peru" weight="duotone" />} 
                            >
                            Add Metal
                        </Button>
                        <CModal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
                            <CModalHeader>
                                <CModalTitle>Add New Metal</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <MetalAdd  onClose={handleClose} handleAddMetal={handleAddMetal} />
                            </CModalBody>
                        </CModal>
                    </CCol>
                </CRow>
            </CCardHeader>
            <CCardBody>
                <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {metalList.length > 0 && metalList.map((item, index) => {
                        return (
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <img width={'100%'} src={item.metal.imageUrl} alt="metal" />

                                    </Avatar>
                                </ListItemAvatar>


                                <ListItemText className="text-dark w-25" primary='Metal Name' secondary={item.metal.name} />
                                
                                <ListItemText className="text-dark w-25" primary='Percentage' secondary={item.percentage+' %'} />
                                <ListItemText className="text-dark w-25" primary='Position' secondary={item.is_main? 'Main' : 'Secondary' } />


                              
                                <IconButton onClick={() => handleRemove(index)} aria-label="delete" size="large" color="error">
                                    <XCircle size={30} color="crimson" weight="duotone" />
                                </IconButton>
                                
                            </ListItem>
                        )
                    })}
                </List>
            </CCardBody>
        </CCard>
    )
}
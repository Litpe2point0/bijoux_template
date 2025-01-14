import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
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
    CModalTitle,
    CRow,
    CCol,
    CCardHeader,
    CSpinner,
} from '@coreui/react'
import AppBar from '@mui/material/AppBar';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import { get_product_list, update_product_list } from "../../api/ProductApi";
import Modal_Button from "../component_items/Modal/ModalButton"
import { ArrowCircleUp, Eye, UserCirclePlus } from "phosphor-react";
import { image_url } from "../../api/Back_End_Url";
import AvatarInput from "../component_items/Avatar/Avatar";
//import useStickyHeader, { StickyText } from "../component_items/Ag-grid/useStickyHeader";
import $ from 'jquery'; // Import jQuery
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import { Card } from "@mui/material";
import Staff_Add from "./Modal_body/StaffAdd";
import StaffAdd from "./Modal_body/StaffAdd";
import {get_account_list, get_staff_list } from "../../api/main/accounts/Account_api";
import StaffUpdate from "./Modal_body/StaffUpdate";



export const StaffPageContext = createContext();


const state_creator = (table) => {
    const state = {
        columnDefs: [
            { headerName: "ID", field: "id", flex: 0.4 },
            {
                headerName: "Avatar", flex: 0.5,
                cellRenderer: (params) => {
                    return (
                        <AvatarInput size={50} src={params.data.imageUrl} />)

                },
                editable: false,
            },
            { headerName: "Name", field: "fullname" },
            { headerName: "Contact Number", field: "phone" },
            { headerName: "Address", field: "address" },
            {
                headerName: "Status",
                editable: false,
                cellClass: 'd-flex align-items-center ',
                valueGetter: 'data.deactivated',
                cellRenderer: (params) => {
                    const status = {
                        title: ((params.data.deactivated == 0) ? 'Activated' : 'Deactivated'),
                        color: ((params.data.deactivated == 0) ? 'success' : 'danger'),
                        bg: 'light'
                    }
                    return (
                        <CCard
                            textColor={`${status.color}`}
                            style={{ width: '100px' }}
                            className={` text-center fw-bold rounded-pill px-1 border-2 border-${status.color} bg-${status.bg}`}>
                            {status.title}
                        </CCard>
                    )


                },
            },
            {
                headerName: "Option",
                cellClass: 'd-flex justify-content-center py-0',
                cellRenderer: (params) => {
                    const Modal_props = {
                        updateForm: <StaffUpdate account={params.data} />,
                        title: 'Update Staff [ID: #' + params.data.id+']',
                        button: <Eye size={30} color="purple" weight="duotone" />,
                        update_button_color: 'white'
                    }
                    return (

                        <CButtonGroup style={{ width: '100%', height: "100%" }} role="group" aria-label="Basic mixed styles example">
                            <Modal_Button
                                disabled={false}
                                title={Modal_props.title}
                                content={Modal_props.button}
                                color={Modal_props.color} >
                                {Modal_props.updateForm}
                            </Modal_Button>
                        </CButtonGroup>
                    )

                },
                flex: 0.5,
            }

        ],
        rowData: table

    }
    return state
}

const Staff_Page = () => {
    const [key, setKey] = useState('sale-staff');

    let [state, setState] = useState(null);

    const handleDataChange = async () => {
        //const accountList = await get_account_list();
        const staffList =  await get_staff_list();
        //console.log("staffList ", staffList.data)
        setState({
            sale: state_creator(staffList.data.sale_staff_list),
            design: state_creator(staffList.data.design_staff_list),
            production: state_creator(staffList.data.production_staff_list)
        })

       // alert('ON DATA CHANGE NÈ')
    }


    useEffect(() => {
        handleDataChange()
    }, [])




    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            filter: true,
            autoHeight: true,
            wrapText: true,
            cellClass: 'd-flex align-items-center',
        };
    }, [])
    return (
        <StaffPageContext.Provider value={{ handleDataChange: handleDataChange }}>
            <CRow>
                <CCol xs={12}>
                    {state === null ? <CButton className="w-100" color="secondary" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton> :

                        <Tabs
                            defaultActiveKey="sale-staff"
                            id="fill-tab-example"
                            className="mb-3"
                            activeKey={key}
                            fill
                            onSelect={(key) => {
                                setKey(key)
                                resetHeaderProperties();
                            }}

                        >
                            <Tab eventKey="sale-staff" title="Sale Staff" selected>
                                {key === 'sale-staff' && <div
                                    id="sale-staff"
                                    style={{
                                        boxSizing: "border-box",
                                        height: "100%",
                                        width: "100%"
                                    }}
                                    className="ag-theme-quartz"
                                >
                                    <AgGridReact
                                        enableColResize={true}
                                        columnDefs={state.sale.columnDefs}
                                        rowData={state.sale.rowData}
                                        defaultColDef={defaultColDef}
                                        rowHeight={'70px'}
                                        headerHeight={40}
                                        pagination={true}
                                        paginationPageSize={10}
                                        domLayout='autoHeight'
                                        onGridReady={onGridReady('sale-staff')}

                                    />
                                </div>}




                            </Tab>
                            <Tab eventKey="design-staff" title="Design Staff">
                                {key === 'design-staff' && <div
                                    id="design-staff"
                                    style={{
                                        boxSizing: "border-box",
                                        height: "100%",
                                        width: "100%"
                                    }}
                                    className="ag-theme-quartz"
                                >
                                    <AgGridReact
                                        enableColResize={true}
                                        columnDefs={state.design.columnDefs}
                                        rowData={state.design.rowData}
                                        defaultColDef={defaultColDef}
                                        rowHeight={'70px'}
                                        headerHeight={40}
                                        pagination={true}
                                        paginationPageSize={10}
                                        domLayout='autoHeight'
                                        onGridReady={onGridReady('design-staff')}
                                    />
                                </div>}

                            </Tab>
                            <Tab eventKey="production-staff" title="Production Staff">

                                {key === 'production-staff' && <div
                                    id="production-staff"
                                    style={{
                                        boxSizing: "border-box",
                                        height: "100%",
                                        width: "100%"
                                    }}
                                    className="ag-theme-quartz"
                                >
                                    <AgGridReact
                                        enableColResize={true}
                                        columnDefs={state.production.columnDefs}
                                        rowData={state.production.rowData}
                                        defaultColDef={defaultColDef}
                                        rowHeight={'70px'}
                                        headerHeight={40}
                                        pagination={true}
                                        paginationPageSize={10}
                                        domLayout='autoHeight'
                                        onGridReady={onGridReady('production-staff')}

                                    />
                                </div>}

                            </Tab>
                            <Tab eventKey="add-staff" title={<UserCirclePlus size={30} color="lime" weight="duotone" />}>
                                {key === 'add-staff' && <CCard
                                    textColor={'primary'}
                                    className={`mb-3 border-top-primary border-top-3`}
                                >
                                    <CCardHeader>Add New Staff</CCardHeader>
                                    <CCardBody>
                                        <StaffAdd handleDataChange={handleDataChange} />
                                    </CCardBody>
                                </CCard>}


                            </Tab>

                        </Tabs>
                    }

                </CCol>
            </CRow>






        </StaffPageContext.Provider>
    );

}
export default Staff_Page;

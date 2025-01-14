


import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
  CButton,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react'
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import { get_account_list } from "../../api/main/accounts/Account_api";
import Pagination from "./Items Card Widget/Pagination";
import ModelBanner from "./Items Card Widget/ModelBanner";
import { useNavigate } from "react-router-dom";





const Model_Page = ({mounting_type}) => {
  const navigate= useNavigate()
  //console.log('type nhè',mounting_type.name)
  

  const [key, setKey] = useState('complete');

  // useEffect(() => {
  //   window.location.reload();
  // },[])

  useEffect(() => {
    
    setKey('complete')

  }, [mounting_type])


  return (

    <CRow style={{height:'fit-content'}}>
      <CCol xs={12}>
        

          <Tabs
            defaultActiveKey="template"
            id="fill-tab-example"
            className="mb-3"
            activeKey={key}
            fill
            onSelect={(key) => {
              setKey(key)
              navigate('?page=1')
              resetHeaderProperties();
            }}

          >

            <Tab eventKey="complete" title="Completed">
              {
                key === 'complete' && <div
                  id="complete"
                  style={{
                    boxSizing: "border-box",
                    height: "100%",
                    width: "100%"
                  }}

                >
                  
                  <Pagination  mounting_type={mounting_type} completed={true}  />

                </div>
              }
            </Tab>


            <Tab eventKey="incomplete" title="In-Complete">
              {
                key === 'incomplete' &&
                <div
                  id="incomplete"
                  style={{
                    boxSizing: "border-box",
                    height: "100%",
                    width: "100%"
                  }}

                >
                  {/* <ModelBanner itemsPerPageFromBanner={itemsPerPageFromBanner} /> */}

                  {/* <Pagination completed={false} itemsPerPage={itemsPerPage} /> */}
                  <Pagination  mounting_type={mounting_type} completed={false}  />
                </div>
              }
            </Tab>



          </Tabs>
        

      </CCol>
    </CRow>
  );

}
export default Model_Page;


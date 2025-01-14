import { get } from 'jquery';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { CCol, CRow, CSpinner } from '@coreui/react';
import ModelCard from './ModelCard';
import { useLocation, useNavigate, } from 'react-router-dom';
import ModelBanner from './ModelBanner';
import Modal_Button from '../../component_items/Modal/ModalButton';
import ModelModify from '../Modal_body/model/ModelModify';
import { get_model_list } from '../../../api/main/items/Model_api';





function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Models({ currentModels }) {
  //console.log("currentModels", currentModels)

  return (

    <CRow className='w-100 d-flex justify-content-center'>


      {currentModels && currentModels.map((item) => (
        <CCol className='m-2' sm={6} md={4} lg={4} xl={3} xxl={2}>

          <ModelCard {...item} />

        </CCol>

      ))}


    </CRow>

  );
}


export default function Pagination({ mounting_type, completed }) {
  const navigate = useNavigate();
  const query = useQuery();
  const location = useLocation();


  const [modelList, setModelList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sort, setSort] = useState(0);

  const [currentModels, setCurrentModels] = useState(null);
  const [pageCount, setPageCount] = useState(0);


  const [itemOffset, setItemOffset] = useState(0);

  


  const get_model_list_from_data = async (mounting_type) => {
    //console.log('TYPE', mounting_type.id)
    const model_search_information = {
      mounting_type_id: mounting_type.id,
      mounting_style: [],
      diamond_shape: [],
      metal: []
    }
    const formData = new FormData();
    formData.append('model_search_information', JSON.stringify(model_search_information));
    const model_list = await get_model_list(formData);
    return model_list.data;
  }

  useEffect(() => {
    //alert('ngu 1')


    const page = parseInt(query.get('page')) || 1;
    const style_id = parseInt(query.get('style_id')) || '';

    const newOffset = (page - 1) * itemsPerPage;

    setItemOffset(newOffset);
    setSort(style_id)
  }, [query, itemsPerPage]);

  useEffect(() => {
    //alert('ngu 2')

    const controller = new AbortController();
    const signal = controller.signal;
    setLoading(true)
    const setAttribute = async () => {

      const model_list = await get_model_list_from_data(mounting_type);

      if (completed) {

        setModelList(model_list.model_available)
      } else {

        setModelList(model_list.model_unavailable)
      }

      setLoading(false)
    }

    setAttribute()
    return () => {
      controller.abort();
    };

  }, [mounting_type]);

  useEffect(() => {
    //alert('ngu 3')

    const controller = new AbortController();
    const signal = controller.signal;
    setLoading(true)
    const re_render = async () => {

      const model_list = await get_model_list_from_data(mounting_type);
      var list = completed ? model_list.model_available : model_list.model_unavailable;
      


      if (sort != 0) {
        list = list.filter((item) => { return sort != 0 ? item.mounting_style.id == sort : item })
      }

      setModelList(list)

      const endOffset = itemOffset + itemsPerPage;


      setCurrentModels(list.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(list.length / itemsPerPage));
      setLoading(false);
    }
    re_render()

    return () => {
      controller.abort();
    };

  }, [itemOffset, itemsPerPage, mounting_type]);


  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  useEffect(() => {


    const controller = new AbortController();
    const signal = controller.signal;
    setLoading(true)
    const re_render = async () => {

      const model_list = await get_model_list_from_data(mounting_type);
      const list = (completed ? model_list.model_available : model_list.model_unavailable).filter((item) => { return sort != 0 ? item.mounting_style.id == sort : item });

      setModelList(list)

      const endOffset = itemOffset + itemsPerPage;


      setCurrentModels(list.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(list.length / itemsPerPage));
      setLoading(false);
    }
    re_render()

    return () => {
      controller.abort();
    };

  }, [sort, mounting_type])

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage % modelList.length;
    setItemOffset(newOffset);
    navigate((sort != 0 ? `?style_id=${sort}` : '?') + `&page=${event.selected + 1}`);
  };
  const handleSort = (style_id) => {
    if (style_id != 0) {
      navigate(`?style_id=${style_id}`);

      setItemsPerPage(20)
      setItemOffset(0)
      setSort(style_id)

    } else {
      const pathWithoutQuery = location.pathname;
      navigate(pathWithoutQuery, { replace: true });
      window.location.reload();
    }

  }
  const handleModelAdd = () => {
    
    const pathWithoutQuery = location.pathname;
    navigate(pathWithoutQuery, { replace: true });
    window.location.reload();
  }

  return (
    <div className='d-flex flex-column align-items-center h-100'>
      <CRow className='w-100'>
        <CCol md={6}>
          <ModelBanner currentStyle={sort} currentItemsPerPage={itemsPerPage} itemsPerPageFromBanner={itemsPerPageFromBanner} handleSort={handleSort} />

        </CCol>
        <CCol md={6} className='d-flex justify-content-end'>
          <div className='w-50'>
            <Modal_Button
              disabled={false}
              title={"Add New " + (mounting_type.name || 'Model ?')}
              content={<span className='text-light fw-bold'>Add New Model</span>}
              color={"info"} >
              <ModelModify type={'add'} mounting_type={mounting_type} handleModelAdd={handleModelAdd} />
            </Modal_Button>
          </div>
        </CCol>
      </CRow>

      {loading
        ?
        <div className="d-flex justify-content-center align-items-center h-100" style={{ minHeight: '50vh' }}><CSpinner color="primary" /></div>
        :
        <Models currentModels={currentModels} />
      }

      <ReactPaginate
        previousLabel="< previous"
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination  mt-5"
        containerStyle={{ marginTop: '400px' }}
        activeClassName="active"
        renderOnZeroPageCount={null}
        forcePage={parseInt(query.get('page')) - 1 || 0}
      />
    </div>
  );
}
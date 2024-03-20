import { message,Row,Col } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import Bus from '../components/Bus';

function Home() {

  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const getBuses = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post('/api/buses/get-all-buses',{}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
      dispatch(HideLoading());
      
      if (response.data.success) {
        setBuses(response.data.data);
      }
      else{
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBuses();
  }, []);
  return (
    <div>
      <div></div>
      <div>
        <Row gutter={[10,10]}>
          {buses.map(bus=>(
            <Col lg={12}>
              <Bus bus={bus} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default Home;
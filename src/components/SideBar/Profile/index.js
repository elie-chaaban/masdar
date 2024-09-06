import React, {useState, useEffect} from 'react';

import './style.scss';
import EditPassword from './EditPassword';
import profilepic from '../../../assets/images/profile.png';
import {Row, Col, Container} from 'react-bootstrap';
import {getProfileInfo} from '../../../services/user';
import EditProfile from './EditProfile';
import Loader from '../../Utils/Loader';
import useFetch from '../../../hooks';
import {Animate} from '../../Utils';

const Profile = ({active, click}) => {
  // eslint-disable-next-line no-unused-vars
  const [showEditPassword, setShowEditPassword] = useState(false);
  const {isLoading, response, fetch, isMountedRef} = useFetch(getProfileInfo);
  useEffect(() => {
    fetch();
    return () => (isMountedRef.current = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Animate options={{duration: 500}} className="profile" unMountOnExit enter={active}>
      <div className="header py-2 px-4 d-flex justify-content-between">
        <h5>Profile</h5>
        <button className="btn back" onClick={click}>
          <i className="arrow"></i>
          <i className="arrow mr-2"></i>
        </button>
      </div>
      {isLoading ? (
        <div className="h-75 d-flex align-items-center justify-content-center">
          <Loader color="white">
            <p>Loading...</p>
          </Loader>
        </div>
      ) : (
        response && (
          <div className="content pt-4">
            <Container fluid>
              <Row className="px-4">
                <Col xs={1}>
                  <img src={profilepic} className="img-fluid" alt="profile" />
                </Col>
                <Col xs={11}>
                  <div className="user-info">
                    <div className="mb-2 content-header">
                      <Row className="border-bottom border-light pb-3 align-items-center">
                        <Col>
                          <h3>{response.info.firstName + ' ' + response.info.lastName}</h3>
                        </Col>
                        <Col xs={'auto'} className="ml-auto">
                          <button className="btn" onClick={() => setShowEditPassword(!showEditPassword)}>
                            {!showEditPassword ? 'Change Password' : 'Cancel'}
                          </button>
                        </Col>
                      </Row>
                      <div className="mt-4">
                        <p>{response.info.type === 'Admin' ? 'Administrator' : 'Not Administrator'}</p>
                      </div>
                    </div>
                    <Row>
                      <Col xs={6}>
                        <EditProfile countries={response.countries} profile={response.info} />
                      </Col>
                      <Col xs={6}>
                        <Animate enter={showEditPassword} unMountOnExit options={{duration: 500}}>
                          <EditPassword profile={response.info} click={() => setShowEditPassword(false)} />
                        </Animate>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )
      )}
    </Animate>
  );
};

export default Profile;

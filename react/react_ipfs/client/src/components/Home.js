import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

export const Home = () => {
    const styles ={
        width: '80%',
        height: '100%',
        marginLeft: '10%',
        marginRight: '10%',
        border: '1px solid'
    }
  return (
    <div >
        <Container >
  <Row>
    <Col>1 of 1</Col>
    <Col>2 of 2</Col>
    <Col>3 of 3</Col>
  </Row>
</Container>
    </div>
  )
}

export default Home
import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Player from "./Player"

export const ShowCard  = ({album, songs, showPlayer}) => {

  return (
    <div style={{width: '50%', height: '50%', marginLeft:"25%", padding:"5%"}}>
<Card className="text-center" >
  <Card.Header as="h3">{album.title}</Card.Header>
  <Card.Body>
  <Card.Img  src={`https://ipfs.io/ipfs/${album.cover_hash}`} />
    <Card.Text>
    <Container>
  <Row>
    <Col>
    {showPlayer && <Player songs={songs} />}
    </Col>
  </Row>
</Container>
    </Card.Text>
  </Card.Body>
  <Card.Footer className="text-muted" as="h3">{album.artist}</Card.Footer>
</Card>
</div>
  )
}

export default ShowCard

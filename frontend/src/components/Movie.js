import React, {useState} from 'react';
import '../App.css';
import { 
  Button,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  ButtonGroup,
 } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faStar, faVideo} from '@fortawesome/free-solid-svg-icons'

function Movie(props) {

  const [myRatingMovie, setMyRatingMovie] = useState(0)
  const [isRatingMovie, setIsRatingMovie] = useState(false)

  const [rating, setRating] = useState(props.globalRating)
  const [countRating, setCountRating] = useState(props.globalCountRating)

  var changeLiked = (name, img) => {
    if(props.movieSee == true){
      props.handleClickDeleteMovieParent(name)
    } else {
      props.handleClickAddMovieParent(name, img)
    }
  }


  var setMyRating = (rating) => {
    if(rating < 0){
      rating = 0
    }

    if(rating > 10){
      rating = 10
    }

    setMyRatingMovie(rating)
    setIsRatingMovie(true)
  }

  var tabRating = []
  for(var i=0;i<10;i++){
      var color = {}
      if(i<myRatingMovie){
          color = {color: '#f1c40f'}
      }
      let count = i+1
      tabRating.push(<FontAwesomeIcon onClick={() => setMyRating(count)} style={color} icon={faStar} /> )
  }

  var nbTotalNote = rating * countRating
  var nbTotalVote = countRating

  if(isRatingMovie){
    nbTotalVote +=1
    nbTotalNote += myRatingMovie
  }

  var avgTotal = Math.round(nbTotalNote / nbTotalVote)

  var tabGlobalRating = []
  for(var i=0;i<10;i++){
      var color = {}
      if(i<avgTotal){
          color = {color: '#f1c40f'}
      }
      tabGlobalRating.push(<FontAwesomeIcon style={color} icon={faStar} /> )
  }

  if(props.movieSee){
    var colorLike = {color: '#e74c3c',cursor:'pointer'}
  } else {
    var colorLike = {cursor:'pointer'}
  }

  return (
    <Col xs="12" lg="6" xl="4">
    <Card style={{marginBottom:30}}>
    <CardImg top src={`https://image.tmdb.org/t/p/w500/${props.movieImg}`} alt={props.movieName} />
    <CardBody>
        <p> {props.movieName} <FontAwesomeIcon style={colorLike} icon={faHeart} onClick={() => changeLiked(props.movieName,props.movieImg)} /></p>
        <p>Nombre de vues <Badge color="primary">{Math.round(props.popularity)}</Badge></p>
        <p>Mon avis 
        {tabRating}

        <ButtonGroup size="sm">
            <Button onClick={() => setMyRating(myRatingMovie-1)} color="secondary">-</Button>
            <Button onClick={() => setMyRating(myRatingMovie+1)} color="secondary">+</Button>
        </ButtonGroup>
        </p>
        <p>Moyenne
        {tabGlobalRating}
        ({nbTotalVote} avis)
        </p>
        <CardText>{props.movieDesc}</CardText>
    </CardBody>
    </Card>
    </Col>


  );
}

export default Movie;

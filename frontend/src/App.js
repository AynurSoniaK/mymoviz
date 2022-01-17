import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  Container,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  Popover,
  PopoverHeader,
  PopoverBody,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,

} from 'reactstrap';

import Movie from './components/Movie'

function App() {

  const [moviesCount, setMoviesCount] = useState(0)
  const [moviesWishList, setMoviesWishList] = useState([])
  const [moviesList, setMoviesList] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  var handleClickAddMovie = async (name, img) => {
    setMoviesCount(moviesCount + 1)
    setMoviesWishList([...moviesWishList, { name: name, img: img }])
    var cardMovie = await fetch('/wishlist-movie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `name=${name}&img=${img}`
    });
  }

  var handleClickDeleteMovie = async (name) => {
    setMoviesCount(moviesCount - 1)
    setMoviesWishList(moviesWishList.filter(object => object.name != name))
    await fetch(`/wishlist-movie/${name}`, {
      method: 'DELETE'
    });
  }

  var cardWish = moviesWishList.map((movie, i) => {
    return (
      <ListGroupItem>
        <ListGroupItemText onClick={() => { handleClickDeleteMovie(movie.name) }}>
          <img width="25%" src={movie.img} /> {movie.name}
        </ListGroupItemText>
      </ListGroupItem>
    )
  })

  var moviesData = [];

  useEffect(() => {
    async function loadData() {
      var rawResponse = await fetch('/new-movies');
      var response = await rawResponse.json();
      console.log("reponsefetch:", response);


      for (var i = 0; i < response.movies.length; i++) {
        moviesData.push({
          name: response.movies[i].original_title,
          desc: response.movies[i].overview,
          img: response.movies[i].backdrop_path,
          note: response.movies[i].vote_average,
          vote: response.movies[i].vote_count,
          popularity: response.movies[i].popularity
        })
      }
      setMoviesList(moviesData)
    }
    loadData();
  }, []);


  console.log("la nouvelle liste ", moviesList);

  var movieList = moviesList.map((movie, i) => {
    var result = moviesWishList.find(element => element.name == movie.name)
    var isSee = false
    if (result != undefined) {
      isSee = true
    }
    var resultdesc = movie.desc
    if (resultdesc.length > 150) { 
      resultdesc = resultdesc.slice(0, 150) + '...' }

    if (movie.img == null) {
      movie.img = '../public/generique.jpg';
    }

    return (<Movie key={i} movieSee={isSee} handleClickDeleteMovieParent={handleClickDeleteMovie} handleClickAddMovieParent={handleClickAddMovie} movieName={movie.name} movieDesc={resultdesc} movieImg={movie.img} globalRating={movie.note} globalCountRating={movie.vote} popularity={movie.popularity} />)
  })



  return (
    <div style={{ backgroundColor: "#232528" }}>
      <Container>
        <Nav>
          <span className="navbar-brand">
            <img src="./logo.png" width="30" height="30" className="d-inline-block align-top" alt="logo" />
          </span>
          <NavItem>
            <NavLink style={{ color: 'white' }}>Dernières sorties</NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <Button id="Popover1" type="button">{moviesCount} films</Button>
              <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                <PopoverHeader>WishList</PopoverHeader>
                <PopoverBody>
                  <ListGroup>
                    {cardWish}
                  </ListGroup>
                </PopoverBody>
              </Popover>
            </NavLink>
          </NavItem>
        </Nav>
        <Row>
          {movieList}
        </Row>
      </Container>
    </div>
  );
}

export default App;

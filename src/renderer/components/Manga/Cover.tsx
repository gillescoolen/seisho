import React from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga';
import { Link } from "react-router-dom";

const Cover = (props: { manga: Manga }) => {
  return (
    <Link to={{ pathname: props.manga.getDetailsLink(), state: props.manga }}>
      <StyledManga manga={props.manga}>
        <Title>{props.manga.getTitle()}</Title>
      </StyledManga>
    </Link>
  )
};

const StyledManga = styled.div`
  color: white;
  width: 250px;
  height: 400px;
  display: flex;
  background-size: cover;
  flex-direction: column-reverse;
  background-image: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%), ${(props: { manga: Manga }) => `url(${props.manga.getThumbnailUrl()})`};
`;

const Title = styled.h2`
  margin: 0 0 5px 5px;
`;

export default hot(Cover);

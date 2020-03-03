import React from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga/manga';

const Cover = (props: { manga: Manga }) => {
  return (
    <StyledManga manga={props.manga}>
      <Title>{props.manga.getTitle()}</Title>
    </StyledManga>)
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
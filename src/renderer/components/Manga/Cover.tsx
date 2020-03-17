import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga/manga';

const Cover = (props: { manga: Manga }) => {
  return (
    <StyledLink to={{ pathname: props.manga.getDetailsLink(), state: props.manga }}>
      <StyledCover manga={props.manga}>
        <Title>{props.manga.getTitle()}</Title>
      </StyledCover>
    </StyledLink>
  )
};

export const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

const StyledCover = styled.div`
  color: white;
  width: 250px;
  height: 400px;
  display: flex;
  background-size: cover;
  flex-direction: column-reverse;
  transition: 0.5s all;
  background-image: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%), ${(props: { manga: Manga }) => `url(${props.manga.getThumbnailUrl()})`};

  &:hover {
    cursor: pointer;
    transition: 0.1s all;
    box-shadow: 0px 0px 0px 5px #ee4540;
  }

  a {
    color: white;
    text-decoration: none;
  }
`;

const Title = styled.h2`
  margin: 0 0 5px 5px;
`;

export default hot(Cover);

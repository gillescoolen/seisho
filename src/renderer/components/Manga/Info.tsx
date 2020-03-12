import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Manga } from '../../../domain/manga/manga';

const Info = (props: { manga: Manga }) => {
  return (
    <StyledInfo>
      <img src={props.manga.getThumbnailUrl()} />
      <h1>{props.manga.getTitle()}</h1>
      <p>{props.manga.getDescription()}</p>
    </StyledInfo>
  )
};

const StyledInfo = styled.div`
  grid-area: info;
`;

export default hot(Info);

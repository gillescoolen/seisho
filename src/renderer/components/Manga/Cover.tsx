import React from 'react';
import { hot } from 'react-hot-loader/root';
import styledComponents from "styled-components";
import { Manga } from '../../../domain/manga/manga';

const Cover = (manga: Manga) => (
  <StyledManga>
    <h2>{manga.getTitle()}</h2>
  </StyledManga>
);

const StyledManga = styledComponents.div`
  color: white;
  width: 250px;
  height: 500px;
  display: flex;
  flex-direction: column-reverse;
`;

export default hot(Cover);
import React from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga/manga';

const ChapterList = (props: { manga: Manga }) => {
  return (
    <List>
      {props.manga.getChapters().map((chapter, index) => <li key={index}>{chapter.getTitle()}</li>)}
    </List>
  )
};

const List = styled.ul`
  padding: 0;
  list-style: none;

  li {
    padding: 0.5rem;
  }
`;

export default hot(ChapterList);

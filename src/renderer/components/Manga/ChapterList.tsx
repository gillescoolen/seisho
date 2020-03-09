import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga';
import Spinner from '../UI/Spinner';
import styled from 'styled-components';

const ChapterList = (props: { manga: Manga }) => {
  if (props.manga.getChapters().length === 0) {
    return (
      <div>
        <Spinner/>
      </div>
    )
  }
  return (
    <List>
      {props.manga.getChapters().reverse().map((chapter, index) => <li key={index}>{chapter.getTitle()}</li>)}
    </List>
  )
};

const List = styled.ul`
  padding: 0;
  list-style: none;
  border: 3px solid blue;

  li {
    padding: 0.5rem;
    border: 1px solid green;
  }
`;

export default hot(ChapterList);
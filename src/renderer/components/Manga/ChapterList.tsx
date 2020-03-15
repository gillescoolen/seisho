import React from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga/manga';
import { Link } from 'react-router-dom';

const ChapterList = (props: { manga: Manga }) => {
  return (
    <List>
      <Filters>Filters</Filters>
      {props.manga.getChapters().map((chapter, index) => (
        <Chapter
          to={{ pathname: `reader/${props.manga.getDetailsLink()}`, state:{ chapter, manga: props.manga} }}
          key={index}
        >
          {chapter.getTitle()}
        </Chapter>
      ))}
    </List>
  );
};

const Filters = styled.div`
  padding: 1rem 1rem;
  margin: -0.5rem -1rem 0 -1rem;
  font-weight: 700;
  border-bottom: 5px solid #1d2c42;
`;

const List = styled.ul`
  padding: 1rem;
  list-style: none;
  border-radius: 15px;
  border: 5px solid #1d2c42;
`;

const Chapter = styled(Link)`
  color: white;
  padding: 1rem;
  display: block;
  border-radius: 3px;
  text-decoration: none;
  border-bottom: 1px solid #2a3442;

  &:hover {
    cursor: pointer;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export default hot(ChapterList);

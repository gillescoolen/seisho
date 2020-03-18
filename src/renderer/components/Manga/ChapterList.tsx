import React from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga/manga';
import { Link } from 'react-router-dom';
import MangaTracker from '../Tracker/MangaTracker';
import { AniList } from '../../../domain/anilist/anilist';

const ChapterList = (props: { manga: Manga }) => {
  const read = props.manga.getChapters().length - props.manga.getProgress();
  const anilist = new AniList();
  const setUnreadClass = (index: number) => {
    if (props.manga.isUnread()) {
      return 'unread';
    }

    return read > index ? 'unread' : '';
  };
  return (
    <List>
      <Filters>
        <MangaTracker manga={props.manga} tracker={anilist} />
      </Filters>
      {props.manga.getChapters().reverse().map((chapter, index) => (
        <Chapter
          key={index}
          className={setUnreadClass(index)}
          to={{ pathname: `reader/${props.manga.getDetailsLink()}`, state: { chapter, manga: props.manga } }}
        >
          {chapter.getTitle()}
        </Chapter>
      ))}
    </List>
  );
};

const Filters = styled.div`
  padding: 1rem 1rem;
  font-weight: 700;
  border-bottom: 5px solid #1d2c42;
`;

const List = styled.ul`
  padding: 0;
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

  &.unread {
    background-color: #414a5c;
  }

  &:hover {
    cursor: pointer;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export default hot(ChapterList);

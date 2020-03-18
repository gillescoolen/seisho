import React from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga/manga';
import { Link } from 'react-router-dom';
import MangaTracker from '../Tracker/MangaTracker';
import { Chapter } from '../../../domain/manga/chapter';
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

  const viewDate = (chapter: Chapter) => {
    const date = chapter.getDate();
    console.log(date);
    console.log(date.toISOString());
    return `${date.getUTCDate()}-${date.getUTCMonth() + 1}-${date.getUTCFullYear()}`;
  };

  return (
    <List>
      <Filters>
        {anilist.isLoggedIn() && <MangaTracker manga={props.manga} tracker={anilist}/>}
      </Filters>
      {props.manga.getChapters().reverse().map((chapter, index) => (
        <ChapterLink
          to={{ pathname: `reader/${props.manga.getDetailsLink()}`, state: { chapter, manga: props.manga } }}
          key={index}
          className={setUnreadClass(index)}
        >
          {chapter.getTitle()}
          <br/>
          <Date>{viewDate(chapter)}</Date>
        </ChapterLink>
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

const Date = styled.small`
  color: #C8C8C8;
`;

const ChapterLink = styled(Link)`
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

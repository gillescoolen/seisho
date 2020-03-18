import React from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga/manga';
import { Link } from 'react-router-dom';
import MangaTracker from '../Tracker/MangaTracker';
import { Chapter } from '../../../domain/manga/chapter';
import { AniList } from '../../../domain/anilist/anilist';

const ChapterList = (props: { manga: Manga }) => {
  const anilist = new AniList();
  const read = props.manga.getChapters().length - props.manga.getProgress();

  const setUnreadClass = (index: number) => {
    if (props.manga.isUnread()) return 'unread';

    return read > index ? 'unread' : '';
  };

  const viewDate = (chapter: Chapter) => {
    const date = chapter.getDate();
    return `${date.getUTCDate()}-${date.getUTCMonth() + 1}-${date.getUTCFullYear()}`;
  };

  return (
    <List>
      <Filters>
        {anilist.isLoggedIn() && <MangaTracker manga={props.manga} tracker={anilist} />}
      </Filters>
      {props.manga.getChapters().reverse().map((chapter, index) => (
        <ChapterLink
          key={index}
          className={setUnreadClass(index)}
          to={{ pathname: `reader/${props.manga.getDetailsLink()}`, state: { chapter, manga: props.manga } }}
        >
          {chapter.getTitle()}
          <br />
          <Date>{viewDate(chapter)}</Date>
        </ChapterLink>
      ))}
    </List>
  );
};

const Filters = styled.div`
  padding: 1rem 1rem;
  font-weight: 700;
  border-bottom: 3px solid #1c293b;
`;

const List = styled.ul`
  padding: 0;
  list-style: none;
  border-radius: 15px;
  border: 3px solid #1c293b;
`;

const Date = styled.small`
  opacity: 0.4;
`;

const ChapterLink = styled(Link)`
  color: white;
  opacity: 0.3;
  padding: 1rem;
  display: block;
  text-decoration: none;
  border-bottom: 1px solid #1c293b;

  &.unread {
    opacity: 1;
  }

  &:hover {
    cursor: pointer;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export default hot(ChapterList);

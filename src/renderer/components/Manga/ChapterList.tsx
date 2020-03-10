import React from 'react';
import { hot } from 'react-hot-loader/root';
import Spinner from '../UI/Spinner';
import { Manga } from '../../../domain/manga/manga';

const ChapterList = (props: { manga: Manga }) => {
  if (props.manga.getChapters().length === 0) {
    return (
      <div>
        <Spinner/>
      </div>
    )
  }
  return (
    <ul>
      {props.manga.getChapters().map((chapter, index) => <li key={index}>{chapter.getTitle()}</li>)}
    </ul>
  )
};

export default hot(ChapterList);

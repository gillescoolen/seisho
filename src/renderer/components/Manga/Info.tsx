import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga/manga';

const Info = (props: { manga: Manga }) => {
  return (
    <div>
      <img src={props.manga.getThumbnailUrl()} />
      <h1>{props.manga.getTitle()}</h1>
      <p>{props.manga.getDescription()}</p>
    </div>
  )
};

export default hot(Info);

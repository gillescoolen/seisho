import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga';

const Single = (props: any) => {
  const [manga] = useState<Manga>(props.location.state);

  useEffect(() => {
    (async () => {
      await manga.fetchDetails();
    })();
  }, [manga]);


  return (
    <div>
      <h1>{manga.getTitle()}</h1>
      <p>{manga.getDescription()}</p>
      <ul>
        {manga.getChapters().map((chapter, index) => <li key={index}>{chapter.getTitle()}</li>)}

      </ul>
    </div>
  )
};

export default hot(Single);
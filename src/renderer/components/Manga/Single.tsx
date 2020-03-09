import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga';
import { ChapterList } from '.';

const Single = (props: any) => {
  const [manga] = useState<Manga>(props.location.state);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await manga.fetchDetails();
      setLoading(false);
    })();
  }, [loading]);
  return (
    <div>
      <h1>{manga.getTitle()}</h1>
      <p>{manga.getDescription()}</p>
      <ChapterList manga={manga} />
    </div>
  )
};

export default hot(Single);
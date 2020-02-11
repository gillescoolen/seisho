import Cover from "./Cover";
import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import styledComponents from "styled-components";
import { Mangasee } from '../../../domain/mangasee';
import { Manga } from '../../../domain/manga/manga';

const mangasee = new Mangasee();
const manga = [];

const Overview = () => {
  useEffect(() => {
    (async function anyNameFunction() {
      const data: Manga[] = await mangasee.search('berserk', 0);
      data.forEach(info => manga.push(<Cover {...info} />));
      console.log(data);
      console.log(manga);
      console.log(mangasee.search);
    })();
  }, []);

  return (
    <Container>
      <h1>YEET</h1>
      {manga.map(m => m)}
    </Container>
  )
}

const Container = styledComponents.div`
  display: grid;
  grid-template-columns: repeat(auto-fix, 250px);
`;

export default hot(Overview);
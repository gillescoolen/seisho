import Cover from "./Cover";
import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import styled from "styled-components";
import { Mangasee } from '../../../domain/mangasee';
import { Manga } from '../../../domain/manga/manga';

const Overview = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [manga, setManga] = useState<Manga[]>([]);

  useEffect(() => {
    (async function anyNameFunction() {
      setManga(await new Mangasee().search(search, page));
    })();
  }, [setManga, setPage, setSearch]);

  return (
    <Container>
      {manga.map((info, index) => <Cover manga={info} key={index} />)}
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  padding: 1rem;
  grid-gap: 25px;
  place-items: center;
  justify-content: space-evenly;
  grid-template-columns: repeat(auto-fit, 250px);
`;

export default hot(Overview);

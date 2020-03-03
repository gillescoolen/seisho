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
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    (async () => {
      setLoadMore(false);
      setManga([...manga, ...await new Mangasee().search(search, page)]);
      setPage(page + 1)
    })();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  async function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    setLoadMore(true);
  }

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

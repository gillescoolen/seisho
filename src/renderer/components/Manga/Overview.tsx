import Cover from "./Cover";
import styled from "styled-components";
import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState } from 'react';
import { Manga } from '../../../domain/manga/manga';
import { MangaseeSource } from '../../../domain/manga/mangasee/mangasee-source';

const Overview = () => {
  const [search] = useState('');
  const [page, setPage] = useState(1);
  const [manga, setManga] = useState<Manga[]>([]);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    (async () => {
      setLoadMore(false);
      setManga([...manga, ...await new MangaseeSource().search(search, page)]);
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
  grid-gap: 20px;
  place-content: center;
  grid-template-columns: repeat(auto-fit, 250px);
`;

export default hot(Overview);
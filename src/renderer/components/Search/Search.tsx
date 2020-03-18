import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { motion } from 'framer-motion';
import Tag from './Tag';

// tslint:disable-next-line: max-line-length
const Search = (props: { genres: string[], search: (value: string) => void, close: () => void, toggle: (name: string) => void }) => {
  const [value, setValue] = useState('');
  const [values, setValues] = useState({ active: false, width: 192, height: 36 });
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [searched]);

  const open = () => setValues({ active: true, width: 512, height: 256 });

  const handleKeydown = (e: KeyboardEvent) => e.key === 'Escape' ? close() : open();

  const handleInputKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && submit();

  const close = () => {
    searched && props.close();
    setValue('');
    setSearched(false);
    setValues({ active: false, width: 192, height: 36 });
  }

  const submit = () => {
    if (!value.trim()) return;
    setSearched(true);
    props.search(value);
  };

  const search = (event: React.FormEvent<HTMLInputElement>) => setValue(event.currentTarget.value);

  const toggle = (genre: string) => {
    props.toggle(genre)
    setSearched(true);
    props.search(value);
  };

  return (
    <Container
      initial={values}
      animate={values}
      transition={{ duration: 0.2 }}
    >
      {values.active
        ?
        <SearchContainer>
          <Input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            autoFocus={true}
            value={value}
            onChange={search}
            onKeyPress={handleInputKeydown}
          />
          <Filters
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            {props.genres.map((genre, index) => (
              <Tag key={index} name={genre} toggle={toggle} />
            ))}
          </Filters>
          <Close onClick={close} />
        </SearchContainer>
        : <Hint onClick={open}>Click to search..</Hint>
      }
    </Container>
  )
};

const Container = styled(motion.div)`
  bottom: 0;
  display: flex;
  position: fixed;
  align-items: flex-end;
  justify-content: center;
`;

const Filters = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 1rem 0rem;
  flex-direction: row;
`;

const Hint = styled.button`
  width: 100%;
  border: none;
  color: white;
  height: 100%;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  padding: 0.5rem 1rem;
  transition: 0.1s all;
  background-color: #1b2033;
  border-radius: 5px 5px 0 0;

  &:hover {
    transition: 0.2s all;
    background-color: #222a47;
  }

  &:focus {
    outline: none;
  }
`;

const Close = styled.button`
  top: -32px;
  right: 6px;
  padding: 0;
  color: white;
  border: none;
  width: 0.8rem;
  height: 0.8rem;
  cursor: pointer;
  border-radius: 100%;
  position: absolute;
  transition: 0.2s all;
  background-color: #ba1414;

  &:hover {
  transition: 0.1s all;
    background-color: #d61a1a;
  }

  &:focus {
    outline: none;
  }
`;

const SearchContainer = styled(motion.div)`
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  padding: 1.2rem 1rem;
  align-items: center;
  flex-direction: column;
  background-color: #181b21;
  border-radius: 5px 5px 0 0;
`;

const Input = styled(motion.input)`
  width: 100%;
  color: white;
  border: none;
  height: 1.5rem;
  padding: 0.3rem;
  font-size: 16px;
  font-weight: 700;
  border-radius: 5px;
  flex-direction: column;
  background-color: transparent;

  &:focus {
    outline: red;
  }
`;

export default hot(Search);
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { motion } from 'framer-motion';
import Filters from './Filters';

const Search = (props: { search: (value: string) => void, close: () => void }) => {
  const [value, setValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [values, setValues] = useState({ active: false, width: 192, height: 36 });

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const open = () => setValues({ active: true, width: 512, height: 256 });

  const handleKeydown = (e: KeyboardEvent) => {
    // e.key === 'Enter' && console.log('Entered');
    console.log(`Value: ${value}.`);

    if (e.key === 'ArrowRight') {
      console.log('Entered');
      console.log(`Value: ${value}.`);
      submit();
    }

    e.key === 'Escape' && close();

    if (values.active || e.key === 'Escape' || e.key === 'Enter') return;

    open();
  }

  const close = () => {
    hasSearched && props.close();
    setValue('');
    setHasSearched(false);
    setValues({ active: false, width: 192, height: 36 });
  }

  const submit = () => {
    console.log('Hey');
    console.log(`Value: ${value}.`);

    if (!value.trim()) return;
    console.log(`Value: ${value}.`);
    props.search(value);
    setHasSearched(true);
  };

  const search = (event: React.FormEvent<HTMLInputElement>) => setValue(event.currentTarget.value);

  return (
    <Container
      initial={values}
      animate={values}
      transition={{ duration: 0.2 }}
    >
      {values.active
        ?
        <SearchContainer>
          <Input autoFocus={true} value={value} onChange={search} />
          <button onClick={submit}>Search</button>
          <Filters />
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

const Hint = styled.button`
  width: 100%;
  border: none;
  color: white;
  height: 100%;
  cursor: pointer;
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
  width: 0.6rem;
  height: 0.6rem;
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

const Input = styled.input`
  width: 100%;
  color: white;
  border: none;
  height: 1.5rem;
  padding: 0.3rem;
  font-size: 16px;
  border-radius: 5px;
  flex-direction: column;
  background-color: #1b2033;

  &:focus {
    outline: red;
  }
`;

export default hot(Search);
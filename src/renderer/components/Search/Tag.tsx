import React, { useState } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { motion } from 'framer-motion';

// tslint:disable-next-line: max-line-length
const Genre = (props: { key: number, name: string, toggle: (genre: string) => void }) => {
  const [count, setCount] = useState(1);
  const [color, setColor] = useState('#232636');

  const toggle = () => {
    setColor(switchColor());
    props.toggle(props.name);
  }
  //TODO: Think of something better for this.
  const switchColor = () => {
    if (count === 1) {
      setCount(2);
      return '#19a800';
    }

    if (count === 2) {
      setCount(0);
      return '#a80000';
    }

    setCount(1);
    return '#232636';

  }

  return (
    <Tag onClick={toggle} style={{ backgroundColor: color }}>{props.name}</Tag>
  )
};

const Tag = styled(motion.div)`
  margin: 0.1rem;
  padding: 0.3rem;
  cursor: pointer;
  user-select: none;
  border-radius: 5px; 
  background-color: #232636;
`;

export default hot(Genre);

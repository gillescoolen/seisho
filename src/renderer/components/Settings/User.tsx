import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { AniList } from '../../../domain/anilist/anilist';
import { motion } from 'framer-motion';

const User = () => {
  const anilist = new AniList();
  const [show, setShow] = useState(false);
  const [loggedIn, setLoggedIn] = useState(anilist.isLoggedIn());

  useEffect(() => {
    setLoggedIn(anilist.isLoggedIn());
  }, [loggedIn]);

  const login = async () => {
    await anilist.login();
    setLoggedIn(true);
  }

  const logout = async () => {
    anilist.logout();
    setLoggedIn(false);
    setShow(false);
  }

  const toggle = () => setShow(!show);

  return (
    <Container>
      {anilist.isLoggedIn()
        ? <Profile onClick={toggle} src={anilist.getCurrentUser()?.avatar.large} />
        : <Login onClick={login}>Login</Login>
      }
      {show &&
        <Menu
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div onClick={logout}>Logout</div>
        </Menu>
      }
    </Container>
  )
};

const Menu = styled(motion.div)`
  right: 0;
  padding: 0.8rem;
  font-size: 14px;
  text-align: right;
  position: absolute;
  border-radius: 5px;
  background-color: #202736;
`;

const Login = styled.button`
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 700;
  border-radius: 5px;
  transition: 0.2s all;
  padding: 0.6rem 0.8rem;
  background-color: #438c3c;

  &:hover {
    cursor: pointer;
    transition: 0.1s all;
    background-color: #4ead45;
  }
`;

const Container = styled.div`
  top: 0.5rem;
  color: white;
  right: 0.5rem;
  cursor: pointer;
  position: fixed;
  font-weight: 700;
`;

const Profile = styled.img`
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 100%;
  transition: 0.2s all;
  border: 4px solid #202736;
  background-color: #181b21;
  box-shadow: 0px 0px 8px 2px rgba(0,0,0,0.4);
`;

export default hot(User);
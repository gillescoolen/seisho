import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { AniList } from '../../../domain/anilist/anilist';

const User = () => {
  const anilist = new AniList();
  const [loggedIn, setLoggedIn] = useState(anilist.isLoggedIn());

  useEffect(() => {
    setLoggedIn(anilist.isLoggedIn());
  }, [loggedIn]);

  const login = async () => {
    await anilist.login();
    setLoggedIn(true);
  }

  const logout = () => {
    anilist.logout();
    setLoggedIn(false);
  }

  return (
    <Container>
      {anilist.isLoggedIn()
        ? <Profile onClick={logout} src={anilist.getCurrentUser()?.avatar.large} />
        : <Login onClick={login}>Login</Login>
      }
    </Container>
  )
};

const Login = styled.button`
  color: white;
  border: none;
  font-weight: 700;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  transition: 0.2s all;
  background-color: #438c3c;

  &:hover {
    transition: 0.1s all;
    cursor: pointer;
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
  border: 4px solid white;
  background-color: black;
  box-shadow: 0px 0px 8px 2px rgba(0,0,0,0.4);

  &:hover {
    transition: 0.1s all;
    border-radius: 100% 100% 0 0;
  }
`;

export default hot(User);
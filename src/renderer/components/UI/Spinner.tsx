import React from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';

const Spinner = () => {
  return (
    <SpinWrapper>
      <div className="spinner">
        <div className="spinner-dot" />
        <div className="spinner-dot" />
        <div className="spinner-dot" />
        <div className="spinner-dot" />
        <div className="spinner-dot" />
        <div className="spinner-dot" />
      </div>
    </SpinWrapper>
  )
};


const SpinWrapper = styled.div`
  .spinner {
    width: 40px;
    height: 40px;
    position: relative;
    animation: spinner 2.5s infinite linear both;
  }

  .spinner-dot {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    animation: spinner-dot 2.0s infinite ease-in-out both;

    &:before {
      content: '';
      display: block;
      width: 25%;
      height: 25%;
      background-color: #fff;
      border-radius: 100%;
      animation: spinner-dot-before 2.0s infinite ease-in-out both;
    }
    &:nth-child(1) {
      animation-delay: -1.1s;
      &:before {
        animation-delay: -1.1s;
      }
    }
    &:nth-child(2) {
      animation-delay: -1.0s;
      &:before {
        animation-delay: -1.0s;
      }
    }
    &:nth-child(3) {
      animation-delay: -0.9s;
      &:before {
        animation-delay: -0.9s;
      }
    }
    &:nth-child(4) {
      animation-delay: -0.8s;
      &:before {
        animation-delay: -0.8s;
      }
    }
    &:nth-child(5) {
      animation-delay: -0.7s;
      &:before {
        animation-delay: -0.7s;
      }
    }
    &:nth-child(6) {
      animation-delay: -0.6s;
      &:before {
        animation-delay: -0.6s;
      }
    }
  }

  @keyframes spinner {
    100% { transform: rotate(360deg); } 
  }

  @keyframes spinner-dot {
    80%, 100% { transform: rotate(360deg); } 
  }

  @keyframes spinner-dot-before {
    50% {
      transform: scale(0.4); 
    } 100%, 0% {
      transform: scale(1.0); 
    } 
  }
`;

export default hot(Spinner);
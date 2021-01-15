import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { toogleMenu } from '../app/menuSlice';
import CharacterLinkList from './linkList';

export const StyledMenu = styled.div`
  display: flex;
  flex-direction: column;
  background: #444444;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  height: 100vh;
  text-align: right;
  padding: 50px 10px;
  position: absolute;
  top: 0;
  right: 0;
  transition: transform 0.3s ease-in-out;
  border-left: solid 1px grey;
  z-index: 10;

  @media (max-width: 576px) {
    width: 100%;
  }
`;

const StyledBurger = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 11;

  &:focus {
    outline: none;
  }

  div {
    width: 40px;
    height: 5px;
    background: ${({ isOpen }) => (isOpen ? '#DDDDDD' : '#EFFFFA')};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg)' : 'rotate(0)')};
    }

    :nth-child(2) {
      opacity: ${({ isOpen }) => (isOpen ? '0' : '1')};
      transform: ${({ isOpen }) =>
        isOpen ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
      transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`;

const MenuContainer = styled.div``;

const Menu = ({}) => {
  const dispatch = useDispatch();

  const { isOpen } = useSelector(state => state.menu);

  return (
    <>
      <StyledBurger isOpen={isOpen} onClick={() => dispatch(toogleMenu())}>
        <div />
        <div />
        <div />
      </StyledBurger>
      <StyledMenu isOpen={isOpen}>
        <h1>Menu</h1>
        <h2>Character links</h2>
        <MenuContainer>
          <CharacterLinkList />
        </MenuContainer>
      </StyledMenu>
    </>
  );
};

export default Menu;

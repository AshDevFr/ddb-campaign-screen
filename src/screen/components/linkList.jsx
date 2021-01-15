import { h } from 'preact';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { addId, removeId } from '../app/optionsSlice';

const MainContainer = styled.div``;
const StyledInput = styled.input``;
const List = styled.div`
  margin: 10px;
`;
const ListItem = styled.div`
  margin: 0 0 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background: #25282a;
  text-align: left;
`;
const RemoveBtn = styled.button`
  background: red;
  color: white;
  font-weight: bold;
  font-size: 80%;
  border-radius: 20px;
  height: 20px;
  width: 20px;
  padding: 2px;
  text-align: center;
  border: none;
`;

const CharacterLinkList = ({}) => {
  const dispatch = useDispatch();

  const { characterIds } = useSelector(state => state.options);

  const renderItem = ({ uid, id }) => (
    <ListItem>
      <span>{id}</span>
      <RemoveBtn onClick={() => dispatch(removeId({ uid, id }))}>-</RemoveBtn>
    </ListItem>
  );

  const onKeyPressHandle = event => {
    if (event.key === 'Enter') {
      dispatch(addId(event.target.value));
      event.target.value = '';
    }
  };

  return (
    <MainContainer>
      <List>{characterIds.map(renderItem)}</List>
      <StyledInput
        placeholder="Add character Id"
        onKeyPress={onKeyPressHandle}
      />
    </MainContainer>
  );
};

export default CharacterLinkList;

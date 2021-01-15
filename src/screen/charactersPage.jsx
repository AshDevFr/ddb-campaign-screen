import { h } from 'preact';
import styled from 'styled-components';
import CharacterList from './components/characterList';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'preact/hooks';
import { fetchCharacter } from './app/characterSlice';

const PageTitle = styled.h2`
  text-align: center;
  padding-bottom: 10px;
`;

const LoadingImg = styled.img`
  position: absolute;
  height: 24px;
  width: 24px;
  right: 15px;
`;

const ErrorContainer = styled.div`
  font-size: 1.2em;
`;

const CharactersPage = ({ config, tabId }) => {
  const dispatch = useDispatch();

  const { isLoading, error, characters } = useSelector(
    state => state.characters
  );

  const { characterIds } = useSelector(state => state.options);
  const ids = characterIds.map(({ id }) => id);

  const refreshData = initialCall => {
    if (!config.refresh && !initialCall) return;

    characterIds.forEach(({ id }) => dispatch(fetchCharacter(id, tabId)));

    setTimeout(() => refreshData(), config.refreshTime * 1000);
  };

  useEffect(() => {
    refreshData(true);
  }, [ids.join()]);

  return (
    <>
      {isLoading ? <LoadingImg src="assets/spinner.gif" /> : null}
      <PageTitle>Character list</PageTitle>
      <CharacterList characters={characters} />
      {error ? <ErrorContainer>{error}</ErrorContainer> : null}
    </>
  );
};

export default CharactersPage;

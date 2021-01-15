import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import styled, { css } from 'styled-components';
import Grid from 'styled-components-grid';
import Switch from '../common/components/switch';

const AppContainer = styled.div`
  min-width: 400px;
  font-size: 1.2em;
`;

const Title = styled.h1`
  text-align: center;
  border-bottom: 1px solid grey;
  padding-bottom: 10px;
`;

const RedSpan = styled.span`
  color: red;
  font-weight: bold;
`;

const Subtitle = styled.h2``;
const Value = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;

  float: right;
`;

const FlexItem = styled.div`
  flex: 1;
`;

const LinkContainer = styled.div`
  margin-top: 20px;
`;
const Link = styled.a`
  font-weight: bold;
  text-decoration: none;
  color: red;
`;

const App = ({ config }) => {
  const [autoload, setAutoload] = useState(config.autoload);
  const [refresh, setRefresh] = useState(config.refresh);
  const [refreshTime, setRefreshTime] = useState(config.refreshTime);

  useEffect(() => {
    const newConfig = Object.assign({}, config, {
      autoload,
      refresh,
      refreshTime
    });

    chrome.storage.sync.set(
      {
        config: newConfig
      },
      null
    );
  });

  const handleRefreshTimeChange = event => setRefreshTime(event.target.value);

  return (
    <AppContainer id="app-root">
      <Title>
        <RedSpan>D&D</RedSpan> Beyond Campaign DM Screen
      </Title>
      <Subtitle>Option</Subtitle>

      <Grid>
        <Grid.Unit size={7 / 10}>Autoload embedded screen: </Grid.Unit>
        <Grid.Unit size={3 / 10}>
          <Value>
            <FlexItem>
              <Switch
                size={'x-small'}
                isOn={autoload}
                handleToggle={() => setAutoload(!autoload)}
              />
            </FlexItem>
          </Value>
        </Grid.Unit>
        <Grid.Unit size={7 / 10}>Refresh: </Grid.Unit>
        <Grid.Unit size={3 / 10}>
          <Value>
            <FlexItem>
              <Switch
                size={'x-small'}
                isOn={refresh}
                handleToggle={() => setRefresh(!refresh)}
              />
            </FlexItem>
          </Value>
        </Grid.Unit>
        <Grid.Unit size={7 / 10}>Refresh time: </Grid.Unit>
        <Grid.Unit size={3 / 10}>
          <Value>
            <select value={refreshTime} onChange={handleRefreshTimeChange}>
              <option value="30">30 s</option>
              <option value="60">60 s</option>
              <option value="90">90 s</option>
              <option value="120">2 min</option>
              <option value="300">5 min</option>
              <option value="600">10 min</option>
            </select>
          </Value>
        </Grid.Unit>
        <Grid.Unit size={1}>
          <LinkContainer>
            <Link
              href="https://github.com/AshDevFr/encounters_app/issues/new?labels=bug,extension&template=bug_report.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report an Issue
            </Link>
          </LinkContainer>
        </Grid.Unit>
      </Grid>
    </AppContainer>
  );
};

export default App;

import { h } from 'preact';
import styled from 'styled-components';

export const MainContainer = styled.div`
  margin: 5px;
  border: solid 1px grey;
  padding: 5px;
  background-color: #404040;
  height: 100%;
  box-sizing: border-box;
`;

export const HeaderContainer = styled.div`
  position: relative;
  padding: 30px 20px;

  border-bottom: 1px solid #838383;
`;

export const HeaderBG = styled.div` 
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  background-image: url('${props => props.bgImage}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.6);
    backdrop-filter: blur(2px);
  }
`;
export const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
`;

export const StatsContainer = styled.div``;

export const RowContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const PortraitContainer = styled.div`
  flex: 0 0 auto;
`;

export const Portrait = styled.img`
  border-radius: 3px;
  height: 60px;
  width: 60px;
  margin-right: 10px;
`;

export const CharacterInfoContainer = styled.div`
  flex: 1 1 100%;
  min-width: 0;
  padding-right: 10px;
`;

export const CharacterTopInfo = styled.div`
  font-size: 22px;
`;

export const CharacterInfo = styled.div`
  color: #bdbdbd;
`;

export const Block = styled.div`
  position: relative;
  cursor: pointer;
  text-align: center;
  margin-right: 10px;
  margin-left: 10px;
`;

export const Header = styled.div`
  font-size: 12px;
`;

export const Footer = styled.div`
  font-size: 13px;
`;

export const Label = styled.div`
  text-transform: uppercase;
  font-family: Roboto Condensed, Roboto, Helvetica, sans-serif;
  font-weight: 700;
`;

export const Value = styled.div`
  font-size: 26px;
  font-weight: 500;
  line-height: 27px;
`;

export const InlineGroup = styled.div`
  display: inline-flex;
`;

export const InlineItem = styled.div`
  margin: 0 5px;
`;

export const Distance = styled.span`
  position: relative;
  font-size: 26px;
  font-weight: 500;
`;

export const DistanceLabel = styled.span`
  font-size: 16px;
  position: absolute;
  bottom: 2px;
  color: #838383;
  margin-left: 3px;
`;

export const Number = styled.span`
  display: inline-flex;
  align-items: center;
  vertical-align: top;
`;

export const LargeNumber = styled(Number)`
  position: relative;
`;

export const Sign = styled.span`
  color: #838383;
  margin-right: 1px;
`;

export const LargeSign = styled(Sign)`
  font-size: 20px;
  position: absolute;
  right: 100%;
`;

export const Senses = styled.div`
  margin-top: 10px;
  width: 100%;
  text-align: center;
`;

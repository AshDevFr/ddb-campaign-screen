import { h } from 'preact';
import styled from 'styled-components';
import { genUUID } from '../utils';

const sizes = {
  medium: {
    width: '100px',
    height: '50px',
    btnSsize: '45px',
    borders: '2px',
    active: '60px'
  },
  small: {
    width: '50px',
    height: '25px',
    btnSsize: '23px',
    borders: '1px',
    active: '30px'
  },
  'x-small': {
    width: '30px',
    height: '15px',
    btnSsize: '13px',
    borders: '1px',
    active: '15px'
  }
};

const StyledSwitchInput = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
`;

const StyledSwitchLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: ${props => sizes[props.btnsize].width};
  height: ${props => sizes[props.btnsize].height};
  background: grey;
  border-radius: ${props => sizes[props.btnsize].width};
  position: relative;
  transition: background-color 0.2s;

  ${StyledSwitchInput}:checked + & {
    background: ${props => props.color};
  }
`;

const StyledSwitchBtn = styled.span`{
  content: '';
  position: absolute;
  top: ${props => sizes[props.btnsize].borders};
  left: ${props => sizes[props.btnsize].borders};
  width: ${props => sizes[props.btnsize].btnSsize};
  height: ${props => sizes[props.btnsize].btnSsize};
  border-radius: ${props => sizes[props.btnsize].btnSsize};
  transition: 0.2s;
  background: #fff;
  box-shadow: 0 0 ${props =>
    sizes[props.btnsize].borders} 0 rgba(10, 10, 10, 0.29);
  
  ${StyledSwitchInput}:checked + ${StyledSwitchLabel} & {
    left: calc(100% - ${props => sizes[props.btnsize].borders});
    transform: translateX(-100%);
  }
  
  ${StyledSwitchLabel}:active & {
    width: ${props => sizes[props.btnsize].active};
  }
`;

const Switch = ({ isOn, handleToggle, size, color }) => {
  const uuid = genUUID();
  const btnsize = ['medium', 'small', 'x-small'].includes(size)
    ? size
    : 'small';
  const props = { btnsize, color: color || 'green' };

  return (
    <>
      <StyledSwitchInput
        id={`switch-${uuid}`}
        type="checkbox"
        checked={isOn}
        onChange={handleToggle}
        {...props}
      />
      <StyledSwitchLabel htmlFor={`switch-${uuid}`} {...props}>
        <StyledSwitchBtn {...props} />
      </StyledSwitchLabel>
    </>
  );
};

export default Switch;

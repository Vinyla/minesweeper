import React, { createRef } from 'react';
import bomb from '../assets/images/bomb.png';
import flag from '../assets/images/flag.png';

const Cell = (props) => {
  let cell = createRef;
  const getValue = () => {
    if (!props.value.revealed) {
      return props.value.flagged ? <img src={flag} alt='flag' /> : null;
    }
    if (props.value.isMine) {
      return <img src={bomb} alt='bomb' />;
    }
    if (props.value.neighbour === 0) {
      return null;
    }
    return props.value.neighbour; 
  };

  let className = 'cell' + (props.value.revealed ? ' revealed' : '') + (props.value.flagged ? ' flag' : '');

  return (
    <div
      ref={cell}
      className={className}
      onClick={props.onLeftClick}
      onContextMenu={props.onRightClick}
    >
      {getValue()}
    </div>
  );
};

export default Cell;

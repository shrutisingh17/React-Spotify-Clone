import React from 'react';
import {Bars, Audio} from 'react-loader-spinner';

export default function Loading({ type }) {
  return (
    <div className='loading'>
      {type === 'app' ? (
        <Audio color='#1db954' height={80} width={80} />
      ) : (
        <Bars color='#fff' height={80} width={80} />
      )}
    </div>
  );
}


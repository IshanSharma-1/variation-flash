import React from 'react';

const CoinPool = ({ total }) => {
  return (
    <div className="p-4 border rounded bg-yellow-100">
      <h3 className="font-bold">Total Pool: {total} coins</h3>
    </div>
  );
};

export default CoinPool;

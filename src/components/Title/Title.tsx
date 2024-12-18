import React from 'react';

const Title: React.FC = ({ children }) => (
  <h1 className="text-2xl font-black text-gray-700 my-8 text-center">
    {children}{' '}
  </h1>
);

export default Title;

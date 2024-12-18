import React from 'react';

const BoxWrapper: React.FC = ({ children }) => (
  <section className="h-full w-full flex flex-col justify-center items-center">
    <section className="w-11/12 h-auto flex flex-col justify-center items-center bg-white md:w-2/5 p-4">
      {children}
    </section>
  </section>
);

export default BoxWrapper;

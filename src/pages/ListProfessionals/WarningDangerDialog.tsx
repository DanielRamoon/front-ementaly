import { Button } from '@material-ui/core';
import { MessageAlert } from 'mdi-material-ui';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactGA from 'react-ga4';

interface IWarningDangerDialog {
  onClose: () => void;
}

export const WarningDangerDialog: React.FC<IWarningDangerDialog> = ({
  onClose,
}) => {
  useEffect(() => {
    ReactGA.send('pageview');
  }, []);
  return (
    <div className="flex flex-col justify-center items-center  gap-6">
      <div className="text-8xl">
        <MessageAlert fontSize="inherit" className="text-yellow-400" />
      </div>
      <h2 className="font-black text-2xl">
        <FormattedMessage id="professionals.warning.danger.title" />
      </h2>
      <h3 className="text-xl text-center font-black">
        <FormattedMessage id="professionals.warning.danger.subtitle" />
      </h3>
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className="bg-yellow-400 min-w-0 w-5 h-5 text-lg font-semibold p-4 text-white rounded-full flex items-center justify-center mr-2 mb-6">
            1
          </span>
          <p className="text-gray-400 text-base font-normal">
            Ouço vozes que me falam para fazer coisas ruins
          </p>
        </div>
        <div className="flex">
          <span className="bg-yellow-400 min-w-0 w-5 h-5 text-lg font-semibold p-4 text-white rounded-full flex items-center justify-center mr-2 mb-6">
            2
          </span>
          <p className="text-gray-400 text-base font-normal">
            não consigo encontrar razões para continuar existindo{' '}
          </p>
        </div>
        <div className="flex">
          <span className="bg-yellow-400 min-w-0 w-5 h-5 text-lg font-semibold p-4 text-white rounded-full flex items-center justify-center mr-2 mb-6">
            3
          </span>
          <p className="text-gray-400 text-base font-normal">
            não consigo controlar minha agressividade comigo mesmo ou com outras
            pessoas
          </p>
        </div>
      </div>
    </div>
  );
};

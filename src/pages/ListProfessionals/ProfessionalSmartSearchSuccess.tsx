import { Button } from '@material-ui/core';
import { CheckCircle } from 'mdi-material-ui';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactGA from 'react-ga4';

// import { Container } from './styles';

interface IProfessionalSmartSearchSuccess {
  onClose: () => void;
}

export const ProfessionalSmartSearchSuccess: React.FC<IProfessionalSmartSearchSuccess> = ({
  onClose,
}) => {
  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <div className="flex flex-col justify-center items-center  gap-6">
      <div className="text-8xl">
        <CheckCircle fontSize="inherit" color="primary" />
      </div>
      <strong className="font-black text-2xl">
        <FormattedMessage id="professionals.smart.search.success.title" />
      </strong>
      <span className="text-gray-500 text-base text-center">
        <FormattedMessage id="professionals.smart.search.success.subtitle" />
      </span>
      <Button
        onClick={() => onClose()}
        key="smart-search-end-search"
        variant="contained"
        color="primary">
        <FormattedMessage id="button.done.professional.smart.search" />
      </Button>
    </div>
  );
};

import { Typography } from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';

interface LoadingContainerProps {
  loading: boolean;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = (props) => {
  const { formatMessage } = useIntl();

  if (props.loading) {
    return (
      <div className="p-4">
        <Typography>
          {formatMessage({ id: 'loadingContainer.loading' })}
        </Typography>
      </div>
    );
  }

  if (!React.Children.toArray(props.children).length) {
    return (
      <div className="p-4">
        <Typography>
          {formatMessage({ id: 'loadingContainer.empty' })}
        </Typography>
      </div>
    );
  }

  return (props.children as React.ReactElement) || null;
};

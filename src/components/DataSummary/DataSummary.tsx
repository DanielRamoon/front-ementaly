import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { OpenInNew } from 'mdi-material-ui';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

interface DataSummaryProps {
  title: string;

  description: string;
  left?: React.ReactElement;

  linkLabel: string;
  linkTo: string;
}

export const DataSummary = (props: DataSummaryProps) => {
  const { formatMessage } = useIntl();

  return (
    <div className="mb-4">
      <Typography>
        <b>{props.title}</b>
      </Typography>

      <div className="flex items-center border border-gray-200 mt-2 rounded-md px-4 py-2">
        {props.left}
        <div className="flex-1 mx-2">
          <Typography>
            <b>{props.description}</b>
          </Typography>
        </div>
        <Button
          color="primary"
          endIcon={<OpenInNew />}
          component={Link}
          to={props.linkTo}>
          {props.linkLabel}
        </Button>
      </div>
    </div>
  );
};

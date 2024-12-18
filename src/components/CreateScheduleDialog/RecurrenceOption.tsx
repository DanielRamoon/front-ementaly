import { Box, ButtonBase, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';

interface RecurrenceOptionProps {
  label: string;

  selected: boolean;

  onClick: () => void;
}

export const RecurrenceOption: React.FC<RecurrenceOptionProps> = (
  props: RecurrenceOptionProps,
) => {
  return (
    <div
      className={clsx('border border-gray-200 rounded-md mr-2 mb-2', {
        'border-cyan-500': props.selected,
      })}>
      <ButtonBase onClick={props.onClick}>
        <Box color={props.selected ? 'primary.main' : undefined} p={2}>
          <Typography
            style={{ fontWeight: props.selected ? 'bold' : undefined }}>
            {props.label}
          </Typography>
        </Box>
      </ButtonBase>
    </div>
  );
};

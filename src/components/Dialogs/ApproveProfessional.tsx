import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import clsx from 'clsx';
import { CheckboxMarkedCircleOutline, ProgressClose } from 'mdi-material-ui';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { ProfessionalApi } from '../../apis';
import { IProfessional } from '../../libs';

interface Props {
  isOpen: boolean;
  professional: IProfessional;
  handlerCloseDialog(): void;
  handlerSuccessDialog(): void;
}

type ChecklistValue = 'hasProfile' | 'hasBankAccount' | 'hasWorkingSchedule';

const checklistItems: Array<{ value: ChecklistValue; label: string }> = [
  {
    value: 'hasProfile',
    label: 'dialogs.professional.aprove.checklist.item.hasProfile',
  },
  {
    value: 'hasBankAccount',
    label: 'dialogs.professional.aprove.checklist.item.hasBankAccount',
  },
  {
    value: 'hasWorkingSchedule',
    label: 'dialogs.professional.aprove.checklist.item.hasWorkingSchedule',
  },
];

export const ApproveProfessional: React.FC<Props> = ({
  isOpen,
  handlerCloseDialog,
  handlerSuccessDialog,

  ...props
}) => {
  const [checklist, setChecklist] = useState<Record<ChecklistValue, boolean>>({
    hasProfile: Boolean(props.professional.uuid),
    hasBankAccount: false,
    hasWorkingSchedule: false,
  });

  const [canApprove, setCanApprove] = useState(true);

  useEffect(() => {
    if (!props.professional.uuid) return;

    ProfessionalApi.show(props.professional.uuid, {
      ignoreObjectNotFound: true,
    })
      .then((professional) => {
        const hasBankAccount = Boolean(professional.recipient);
        const hasWorkingSchedule = Object.keys(
          professional.workingSchedule || {},
        ).reduce((hasHourInWeek, dayOfWeek) => {
          const day = professional.workingSchedule[dayOfWeek];

          const hasHourInDay = day.hours.reduce(
            (prev, hour) => hour.selected || prev,
            false,
          );

          return hasHourInWeek || hasHourInDay;
        }, false);

        setChecklist({
          hasProfile: true,
          hasBankAccount,
          hasWorkingSchedule,
        });

        setCanApprove(hasBankAccount && hasWorkingSchedule);
      })
      .catch(() => {
        setChecklist({
          hasProfile: false,
          hasBankAccount: false,
          hasWorkingSchedule: false,
        });

        setCanApprove(false);
      });
  }, []);

  const isChecklistOk = Object.keys(checklist).reduce((prev, next) => {
    return prev && checklist[next as ChecklistValue];
  }, true);

  return (
    <Dialog
      open={isOpen}
      onClose={handlerCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        <FormattedMessage id="dialogs.professional.aprove.title" />
      </DialogTitle>
      <DialogContent>
        <div className="mb-4">
          <FormattedMessage id="dialogs.professional.aprove.description" />
        </div>

        <div className="bg-gray-100 rounded-md p-4 mb-4">
          <div className="mb-4">
            <Typography>
              <b>
                <FormattedMessage id="dialogs.professional.aprove.checklist" />
              </b>
            </Typography>
          </div>
          <div>
            {checklistItems.map((item) => {
              const isChecked: boolean = checklist[item.value] || false;

              return (
                <div
                  className={clsx('flex items-center mb-4', {
                    'text-primary': isChecked,
                    'text-red-500': !isChecked,
                  })}>
                  <div className="mr-4">
                    {isChecked ? (
                      <CheckboxMarkedCircleOutline />
                    ) : (
                      <ProgressClose />
                    )}
                  </div>
                  <Typography color="inherit">
                    <FormattedMessage id={item.label} />{' '}
                    <b>{isChecked ? 'Sim' : 'Não'}</b>
                  </Typography>
                </div>
              );
            })}
          </div>
        </div>

        {!isChecklistOk && (
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={canApprove}
                  onChange={() => setCanApprove((prev) => !prev)}
                />
              }
              label={
                <FormattedMessage id="dialogs.professional.aprove.forceApprove" />
              }
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handlerCloseDialog} color="default">
          <FormattedMessage id="button.cancel" />
        </Button>
        <Button
          onClick={handlerSuccessDialog}
          disabled={!canApprove}
          color="primary"
          variant="contained"
          disableElevation>
          <FormattedMessage id="button.approve" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

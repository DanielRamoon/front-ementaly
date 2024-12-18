import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import { CardSearchOutline, Pencil, Plus } from 'mdi-material-ui';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { ClinicalFollowUpApi } from '../../apis';
import { IClinicalFollowUp, IPatient } from '../../libs';
import { CreateClinicalFollowUpDialog } from '../CreateClinicalFollowUpDialog/CreateClinicalFollowUpDialog';
import { LoadingContainer } from '../LoadingContainer/LoadingContainer';

interface ListClinicalFollowUpProps {
  patient: IPatient;

  createMode?: 'dialog' | 'inline';
}

type Dialogs = 'create' | null;

export const ListClinicalFollowUp = (props: ListClinicalFollowUpProps) => {
  const [followUps, setFollowUps] = useState<IClinicalFollowUp[]>([]);
  const [dialog, setDialog] = useState<Dialogs>(null);
  const [actingOn, setActingOn] = useState<IClinicalFollowUp | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const { formatMessage } = useIntl();

  const find = () => {
    try {
      setLoading(true);

      ClinicalFollowUpApi.find({
        patient: props.patient.uuid,
        page,
        pageSize: rowsPerPage,
      }).then(setFollowUps);
    } catch {
      toast.error(formatMessage({ id: 'genericError' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    find();
  }, [props.patient?.uuid]);

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!props.patient) {
    return null;
  }

  const onCloseDialog = () => {
    setDialog(null);
    setActingOn(null);
  };

  return (
    <>
      <CreateClinicalFollowUpDialog
        mode={props.createMode}
        open={dialog === 'create'}
        onClose={onCloseDialog}
        patient={props.patient}
        followUp={actingOn}
        onComplete={() => {
          find();

          onCloseDialog();
        }}
      />

      {props.createMode === 'inline' && dialog === 'create' ? null : (
        <>
          <div className="flex w-full justify-end mb-4">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Plus />}
              onClick={() => setDialog('create')}>
              <FormattedMessage id="patientProfile.button.addClinicalFollowUp" />
            </Button>
          </div>
          <LoadingContainer loading={isLoading}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <FormattedMessage id="listClinicalFollowUp.header.date" />
                    </TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {followUps.map((followUp) => {
                    const createdAt = moment(followUp.createdAt);

                    return (
                      <TableRow key={followUp.uuid}>
                        <TableCell align="left">
                          {createdAt.format('DD/MM/YYYY HH:mm')}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            color="primary"
                            variant="outlined"
                            startIcon={<CardSearchOutline />}
                            onClick={() => {
                              setActingOn(followUp);
                              setDialog('create');
                            }}
                            style={{ marginRight: 16 }}>
                            <FormattedMessage id="listClinicalFollowUp.button.view" />
                          </Button>

                          <Button
                            color="primary"
                            variant="outlined"
                            disabled={
                              Math.abs(createdAt.diff(undefined, 'hours')) > 24
                            }
                            startIcon={<Pencil />}
                            onClick={() => {
                              setActingOn(followUp);
                              setDialog('create');
                            }}>
                            <FormattedMessage id="listClinicalFollowUp.button.edit" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {followUps.length === 0 ? 'Nenhum registro encontrado' : ''}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                labelDisplayedRows={() =>
                  `${followUps.length} ${
                    followUps.length > 1 ? 'registros' : 'registro'
                  }`
                }
                count={followUps.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                SelectProps={{
                  inputProps: { 'aria-label': 'registros por página' },
                  native: true,
                }}
              />
            </TableContainer>
          </LoadingContainer>
        </>
      )}
    </>
  );
};

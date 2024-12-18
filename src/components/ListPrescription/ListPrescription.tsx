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
import { OpenInNew } from 'mdi-material-ui';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { PrescriptionApi } from '../../apis';
import { IPatient, IPrescription } from '../../libs';
import { LoadingContainer } from '../LoadingContainer/LoadingContainer';

interface ListPrescriptionProps {
  patient?: IPatient;
}

export const ListPrescription = (props: ListPrescriptionProps) => {
  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [actingOn, setActingOn] = useState<IPrescription | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!props.patient) return;

    try {
      setLoading(true);

      PrescriptionApi.find({
        patient: props.patient.uuid,
      }).then(setPrescriptions);
    } catch {
      toast.error(formatMessage({ id: 'genericError' }));
    } finally {
      setLoading(false);
    }
  }, [props.patient?.uuid]);

  const findDocument = async (prescription: IPrescription) => {
    if (!props.patient) return;

    try {
      setActingOn(prescription);

      const { url } = await PrescriptionApi.findDocument({
        uuid: prescription.uuid,
        patient: props.patient.uuid,
      });

      window.open(url, '_blank');
    } catch {
      toast.error(formatMessage({ id: 'genericError' }));
    } finally {
      setActingOn(null);
    }
  };

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

  return (
    <LoadingContainer loading={isLoading}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <FormattedMessage id="listPrescription.header.professional" />
              </TableCell>
              <TableCell align="left">
                <FormattedMessage id="listPrescription.header.date" />
              </TableCell>
              <TableCell align="left" />
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((prescription) => {
              return (
                <TableRow key={prescription.uuid}>
                  <TableCell component="th" scope="row">
                    {prescription.professional.name}
                  </TableCell>
                  <TableCell align="left">
                    {moment(prescription.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell align="left">
                    <div className="ml-2 inline">
                      <label
                        htmlFor={`contained-button-file-${prescription.uuid}`}
                        onClick={() => findDocument(prescription)}>
                        <Button
                          color="primary"
                          component="span"
                          disabled={actingOn?.uuid === prescription.uuid}>
                          <FormattedMessage id="listPrescription.button.download" />
                          <OpenInNew fontSize="small" />
                        </Button>
                      </label>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          labelDisplayedRows={() =>
            `${prescriptions.length} ${
              prescriptions.length > 1 ? 'registros' : 'registro'
            }`
          }
          count={prescriptions.length}
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
  );
};

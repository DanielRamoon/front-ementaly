import {
  Avatar,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import {
  ArrowRight,
  CalendarRange,
  Magnify,
  PlusCircleOutline,
} from 'mdi-material-ui';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { PatientApi } from '../../apis';
import {
  BoxWrapperDashboard,
  InviteUserDialog,
  TitleDashboard,
} from '../../components';
import ModalWrapper from '../../components/ModalWrapper/ModalWrapper';
import { IFilterPatientsDTO, IPatient, UserTypes } from '../../libs';

const columns = [
  'listProfessionalpatients.table.column.patient',
  'listProfessionalpatients.table.column.state',
  'listProfessionalpatients.table.column.nextMeet',
];

const statusType: { [key: string]: string } = {
  recurrent: 'listProfessionalpatients.status.recurrent',
  firstSchedule: 'listProfessionalpatients.status.firstMeet',
  inactive: 'listProfessionalpatients.status.inactive',
  active: 'listProfessionalpatients.status.active',
};

export const ProfessionalPatients: React.FC = () => {
  const [rows, setRows] = useState<Array<IPatient>>([]);

  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState<boolean>(
    false,
  );

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const Intl = useIntl();

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const initializeValues = (): Promise<any> => {
    return Promise.all([setRows([]), setPage(0), setRowsPerPage(10)]);
  };

  const getAllPatients = useCallback(
    async (params: IFilterPatientsDTO) => {
      await PatientApi.list({
        ...params,
        pageSize: rowsPerPage,
      }).then((res) => {
        setRows(res);
      });
    },
    [rowsPerPage],
  );

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  useEffect(() => {
    initializeValues();
    getAllPatients({ page: 1, pageSize: 10 });
  }, []);

  useEffect(() => {
    if (isRefreshData) {
      initializeValues();
      getAllPatients({ page: 1, pageSize: 10 });
    }
  }, [isRefreshData]);

  const handlerSearchProfessional = useCallback(
    async (event) => {
      if (event.code === 'Enter') {
        initializeValues();
        getAllPatients({ page: 1, pageSize: 10, search: event.target.value });
      }
    },
    [rowsPerPage],
  );

  return (
    <section className="h-full">
      <ModalWrapper
        title={Intl.formatMessage({ id: 'invitePatient.title' })}
        moreClass="md:w-4/12"
        open={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}>
        <InviteUserDialog
          onRefresh={() => setIsRefreshData(true)}
          onClose={() => setIsAddPatientModalOpen(false)}
          userType={UserTypes.patient}
        />
      </ModalWrapper>
      <TitleDashboard>
        <FormattedMessage id="listProfessionalpatients.title" />
      </TitleDashboard>
      <BoxWrapperDashboard>
        <section className="w-full h-full bg-white py-5 px-8 m-8 justify-center">
          <div className="flex flex-wrap gap-6 justify-between">
            <h2 className="text-lg font-black text-gray-700">
              <FormattedMessage id="listProfessionalpatients.subtitle" />
            </h2>
            <div className="flex flex-wrap gap-6">
              <button
                type="button"
                onClick={() => setIsAddPatientModalOpen(true)}
                className="flex gap-2.5 text-primary items-center cursor-pointer focus:outline-none">
                <PlusCircleOutline />
                <strong className="text-xs inline-block align-middle">
                  <FormattedMessage id="administrative.patients.add.button" />
                </strong>
              </button>
              <div className="flex gap-2.5 text-gray-400 items-center">
                <TextField
                  label={Intl.formatMessage({
                    id: 'administrative.patients.search.button',
                  })}
                  onKeyDown={handlerSearchProfessional}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end">
                          <Magnify />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <Table
                stickyHeader
                aria-label="administrative users table sticky">
                <TableHead>
                  <TableRow>
                    {columns.map((columnIdName) => (
                      <TableCell align="left">
                        <strong className="text-sm text-gray-400 font-bold">
                          <FormattedMessage id={columnIdName} />
                        </strong>
                      </TableCell>
                    ))}
                    <TableCell align="left" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.uuid}>
                        <TableCell align="left">
                          <Link to={`/patient/profile/${row.uuid}`}>
                            <div className="flex gap-4 items-center">
                              <Avatar alt={row.name} src={row.avatar} />
                              <div>
                                <strong className="block text-sm text-gray-500">
                                  {row.name}
                                </strong>
                              </div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell align="left">
                          <span className="block text-sm text-gray-900">
                            <FormattedMessage
                              id={statusType[row.dynamicStatus]}
                            />
                          </span>
                        </TableCell>
                        <TableCell align="left">
                          <div className="flex gap-2.5 items-center text-sm text-gray-500">
                            <CalendarRange />
                            <span>
                              {row.nextSchedule
                                ? moment(row.nextSchedule.startingAt).format(
                                    'LL',
                                  )
                                : 'Nenhum Agendamento'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          <Link to={`/patient/profile/${row.uuid}`}>
                            <strong
                              className="text-sm text-primary font-bold cursor-pointer"
                              role="button"
                              tabIndex={0}>
                              <FormattedMessage id="button.showProfile" />
                              <ArrowRight fontSize="small" />
                            </strong>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                labelDisplayedRows={() =>
                  `${rows.length} ${rows.length > 1 ? 'registros' : 'registro'}`
                }
                labelRowsPerPage="Itens por página:"
                count={page + 1}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                SelectProps={{
                  inputProps: { 'aria-label': 'registros por página' },
                  native: true,
                }}
              />
            </div>
          </div>
        </section>
      </BoxWrapperDashboard>
    </section>
  );
};

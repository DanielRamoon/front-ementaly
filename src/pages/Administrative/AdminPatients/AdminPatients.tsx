import {
  Avatar,
  ButtonBase,
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
import Alert from '@material-ui/lab/Alert';

import ReactGA from 'react-ga4';
import clsx from 'clsx';
import { CalendarRange, Magnify, PlusCircleOutline } from 'mdi-material-ui';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { PatientApi, UserApi } from '../../../apis';
import {
  BoxWrapperDashboard,
  InviteUserDialog,
  TitleDashboard,
  UserDetailsDialog,
} from '../../../components';
import { DeletePatient } from '../../../components/Dialogs/DeletePatient';
import ModalWrapper from '../../../components/ModalWrapper/ModalWrapper';
import {
  useMaskFormatter,
  useMaskPatterns,
} from '../../../hooks/useMaskFormatter';
import { IFilterPatientsDTO, IPatient, UserTypes } from '../../../libs';

const columns = [
  'administrative.patients.table.column.patient',
  'administrative.patients.table.column.email',
  'administrative.patients.table.column.phone',
  'administrative.patients.table.column.status',
  'administrative.patients.table.column.lastAccess',
];

const statusLabel: any = {
  active: 'profileType.active.label',
  inactive: 'profileType.inactive.label',
  missing: 'profileType.missing.label',
};

type Dialogs = 'invite' | 'delete' | 'userDetails' | null;

export const AdminPatients: React.FC = () => {
  const [rows, setRows] = useState<Array<IPatient>>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchableText, setSearchableText] = useState('');
  const [actingOn, setActingOn] = React.useState<IPatient | null>(null);
  const [page, setPage] = useState<number>(0);
  const [dialog, setDialog] = useState<Dialogs>(null);

  const Intl = useIntl();

  const handlerCloseDialog = (): void => {
    setActingOn(null);
    setDialog(null);
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setPageSize(+event.target.value);
    setPage(0);
  };

  const getAllPatients = async () => {
    const result = await PatientApi.list({
      page: -1,
      pageSize: -1,
      search: searchableText,
    });
    setRows(result);
  };

  useEffect(() => {
    getAllPatients();
  }, [searchableText]);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const handlerDeleteUser = useCallback(async (user: IPatient | null) => {
    if (!user) return;
    await UserApi.delete(user.uuid)
      .then(() => {
        return getAllPatients();
      })
      .then(() => {
        setActingOn(null);
        setDialog(null);
        toast.success(
          Intl.formatMessage({
            id: 'api.administrative.toast.deleteUser.success',
          }),
        );
      });
  }, []);

  return (
    <section className="h-full">
      <TitleDashboard>
        <FormattedMessage id="administrative.patients.title" />
      </TitleDashboard>
      X
      <ModalWrapper
        title={Intl.formatMessage({ id: 'invitePatient.title' })}
        moreClass="md:w-4/12"
        open={dialog === 'invite'}
        onClose={() => setDialog(null)}>
        <InviteUserDialog
          onRefresh={() => {}}
          onClose={() => setDialog(null)}
          userType={UserTypes.patient}
        />
      </ModalWrapper>
      {actingOn && (
        <UserDetailsDialog
          user={actingOn.user}
          open={dialog === 'userDetails'}
          onClose={() => setDialog(null)}
        />
      )}
      <BoxWrapperDashboard>
        <section className="w-full h-full bg-white py-5 px-8 m-8 justify-center">
          <div className="flex flex-wrap gap-6 justify-between">
            <h2 className="text-lg font-black text-gray-700">
              <FormattedMessage id="administrative.patients.containerTitle" />
            </h2>

            <h1>Bem aqui </h1>
            <div className="flex flex-wrap gap-6">
              <ButtonBase onClick={() => setDialog('invite')}>
                <div className="flex gap-2.5 text-gray-400 items-center cursor-pointer">
                  <PlusCircleOutline />
                  <strong className="text-xs inline-block align-middle">
                    <FormattedMessage id="administrative.patients.add.button" />
                  </strong>
                </div>
              </ButtonBase>
              <div className="flex gap-2.5 text-gray-400 items-center">
                <TextField
                  label={Intl.formatMessage({
                    id: 'administrative.patients.search.button',
                  })}
                  onKeyDown={(e: any) => setSearchableText(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Magnify />
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
                    .slice(page * pageSize, page * pageSize + pageSize)
                    .map((row) => (
                      <TableRow key={row.uuid || row.user.uuid}>
                        <TableCell align="left">
                          <Link
                            to={row.uuid ? `/patient/profile/${row.uuid}` : '#'}
                            onClick={() => {
                              if (!row.uuid) {
                                setActingOn(row);
                                setDialog('userDetails');
                              }
                            }}>
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
                            {row.user.email}
                          </span>
                        </TableCell>
                        <TableCell align="left">
                          <span className="block text-sm text-gray-900">
                            {useMaskFormatter(
                              row.phoneNumber,
                              useMaskPatterns.celphone,
                            )}
                          </span>
                        </TableCell>
                        <TableCell align="left">
                          <div className="text-sm text-gray-500">
                            <span className="block text-sm text-gray-500">
                              <FormattedMessage id={statusLabel[row.status]} />
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          <div className="flex gap-2.5 items-center text-sm text-gray-500">
                            <CalendarRange />
                            <span>
                              {moment(row.user.lastSignInAt).format('LL')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          {row.uuid && (
                            <strong
                              className={clsx(
                                'text-sm text-red-500 font-bold',
                                {
                                  'cursor-pointer': Boolean(row.uuid),
                                },
                              )}
                              onClick={() => {
                                if (row.uuid) {
                                  setActingOn(row);
                                  setDialog('delete');
                                }
                              }}
                              role="button"
                              tabIndex={0}>
                              <FormattedMessage id="button.block" />
                            </strong>
                          )}
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
                count={rows.length}
                rowsPerPage={pageSize}
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
        <DeletePatient
          isOpen={dialog === 'delete'}
          handlerCloseDialog={handlerCloseDialog}
          handlerSuccessDialog={() => handlerDeleteUser(actingOn)}
        />
      </BoxWrapperDashboard>
    </section>
  );
};

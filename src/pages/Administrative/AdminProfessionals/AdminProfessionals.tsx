import {
  Avatar,
  ButtonBase,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { CalendarRange, Magnify, PlusCircleOutline } from 'mdi-material-ui';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ProfessionalApi, UserApi } from '../../../apis';
import {
  BoxWrapperDashboard,
  InviteUserDialog,
  TitleDashboard,
  UserDetailsDialog,
} from '../../../components';
import { DeleteProfessional } from '../../../components/Dialogs/DeleteProfessional';
import ModalWrapper from '../../../components/ModalWrapper/ModalWrapper';
import { IProfessional, UserTypes } from '../../../libs';
import {
  ProfessionalType,
  ProfessionalTypes,
} from '../../../libs/IProfessionalType';

const columns = [
  'professional',
  'level',
  'lastactivity',
  'servicesMade',
  'accountstatus',
];

const professionalTypeLabel = {
  psychiatrist: 'professionalType.psychiatrist.label',
  psychologist: 'professionalType.psychologist.label',
};

const statusLabel: any = {
  waiting: 'profileType.waiting.label',
  incomplete: 'profileType.incomplete.label',
  verified: 'profileType.verified.label',
  rejected: 'profileType.rejected.label',
  missing: 'profileType.missing.label',
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

type Dialogs = 'invite' | 'userDetails' | 'delete' | null;

export const AdminProfessionals: React.FC = () => {
  const classes = useStyles();
  const [rows, setRows] = useState<Array<IProfessional>>([]);
  const [actingOn, setActingOn] = React.useState<IProfessional | null>(null);
  const [professionalSearchText, setProfessionalSearchText] = useState('');
  const [professionalStatusFilter, setProfessionalStatusFilter] = useState<
    string[]
  >([]);

  const [orderBy, setOrderBy] = useState('');
  // ASC or DESC
  const [orderDesc, setOrderDesc] = useState(false);

  const [isPsychiatrist, setIsPsychiatrist] = useState(true);
  const [isPsychologist, setIsPsychologist] = useState(true);

  const [dialog, setDialog] = useState<Dialogs>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlerSearchProfessional = async () => {
    const actAs: ProfessionalType[] = [];
    if (isPsychiatrist) actAs.push(ProfessionalTypes.psychiatrist);
    if (isPsychologist) actAs.push(ProfessionalTypes.psychologist);

    ProfessionalApi.list({
      page: -1,
      pageSize: -1,
      search: professionalSearchText,
      statusFilters: professionalStatusFilter,
      orderBy,
      orderDirection: orderDesc ? 'desc' : 'asc',
      actAs,
    }).then((res) => setRows(res));
  };

  const handlerDeleteUser = useCallback(
    async (user: IProfessional | null) => {
      if (!user) return;
      await UserApi.delete(user.uuid)
        .then(() => {
          return handlerSearchProfessional();
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
    },
    [page],
  );

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  useEffect(() => {
    handlerSearchProfessional();
  }, [
    professionalSearchText,
    isPsychiatrist,
    isPsychologist,
    professionalStatusFilter,
    orderBy,
    orderDesc,
  ]);

  return (
    <section className="h-full">
      <TitleDashboard>
        <FormattedMessage id="administrative.professionals.title" />
      </TitleDashboard>

      <ModalWrapper
        title={Intl.formatMessage({ id: 'inviteProfessional.title' })}
        moreClass="md:w-4/12"
        open={dialog === 'invite'}
        onClose={() => setDialog(null)}>
        <InviteUserDialog
          onRefresh={() => {}}
          onClose={() => setDialog(null)}
          userType={UserTypes.professional}
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
          <h2 className="text-lg font-black text-gray-700">
            <FormattedMessage id="administrative.professionals.containerTitle" />
          </h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-wrap gap-6">
              <ButtonBase onClick={() => setDialog('invite')}>
                <div className="flex gap-2.5 text-gray-400 items-center cursor-pointer">
                  <PlusCircleOutline />
                  <strong className="text-xs inline-block align-middle">
                    <FormattedMessage id="administrative.professionals.add.button" />
                  </strong>
                </div>
              </ButtonBase>
              <div className="flex items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPsychiatrist}
                      onChange={() => setIsPsychiatrist(!isPsychiatrist)}
                      name="psychiatrist"
                      color="primary"
                    />
                  }
                  label={
                    <FormattedMessage id="professionalType.psychiatrist.label" />
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPsychologist}
                      onChange={() => setIsPsychologist(!isPsychologist)}
                      name="psychologist"
                      color="primary"
                    />
                  }
                  label={
                    <FormattedMessage id="professionalType.psychologist.label" />
                  }
                />
              </div>
              <div>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="user-status-filter-label">
                    <FormattedMessage id="administrative.professionals.table.column.accountstatus" />
                  </InputLabel>
                  <Select
                    labelId="user-status-filter-label"
                    label={Intl.formatMessage({
                      id:
                        'administrative.professionals.table.column.accountstatus',
                    })}
                    id="user-status-filter"
                    multiple
                    value={professionalStatusFilter}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      setProfessionalStatusFilter(e.target.value as string[]);
                    }}
                    renderValue={(data) => (
                      <div>
                        {(data as string[])
                          .map((it) =>
                            Intl.formatMessage({
                              id: statusLabel[it],
                            }),
                          )
                          .join(', ')}
                      </div>
                    )}>
                    {Object.entries(statusLabel).map(([key, value]) => {
                      return (
                        <MenuItem value={key}>
                          <FormattedMessage id={String(value)} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div className="flex gap-2.5 text-gray-400 items-center">
                <TextField
                  label={Intl.formatMessage({
                    id: 'administrative.professionals.search.button',
                  })}
                  onChange={(e: any) =>
                    setProfessionalSearchText(e.target.value)
                  }
                  value={professionalSearchText}
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
                    {columns.map((columnIdName) =>
                      columnIdName === 'level' ? (
                        <TableCell align="left">
                          <strong className="text-sm text-gray-400 font-bold">
                            <FormattedMessage
                              id={`administrative.professionals.table.column.${columnIdName}`}
                            />
                          </strong>
                        </TableCell>
                      ) : (
                        <TableCell align="left" id="servicesMade">
                          <TableSortLabel
                            active={orderBy === columnIdName}
                            direction={!orderDesc ? 'desc' : 'asc'}
                            onClick={() => {
                              if (orderBy !== columnIdName) {
                                setOrderBy(columnIdName);
                                return setOrderDesc(false);
                              }
                              return setOrderDesc(!orderDesc);
                            }}>
                            <strong className="text-sm text-gray-400 font-bold">
                              <FormattedMessage
                                id={`administrative.professionals.table.column.${columnIdName}`}
                              />
                            </strong>
                            {orderBy === columnIdName ? (
                              <span
                                style={{
                                  border: 0,
                                  clip: 'rect(0 0 0 0)',
                                  height: 1,
                                  margin: -1,
                                  overflow: 'hidden',
                                  padding: 0,
                                  position: 'absolute',
                                  top: 20,
                                  width: 1,
                                }}>
                                {orderDesc
                                  ? 'sorted descending'
                                  : 'sorted ascending'}
                              </span>
                            ) : null}
                          </TableSortLabel>
                        </TableCell>
                      ),
                    )}
                    <TableCell align="left" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow key={row.uuid || row.user.uuid}>
                          <TableCell align="left">
                            <Link
                              to={
                                row.uuid
                                  ? `/professional/profile/${row.uuid}`
                                  : '#'
                              }
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
                              {row.actAs.map((profession) => (
                                <span className="block text-sm text-gray-500">
                                  <FormattedMessage
                                    id={professionalTypeLabel[profession]}
                                  />
                                </span>
                              ))}
                            </span>
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
                            <div className="text-sm text-gray-500">
                              <span className="block text-sm text-gray-500">
                                {row.servicesMade}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div className="text-sm text-gray-500">
                              <span className="block text-sm text-gray-500">
                                <FormattedMessage
                                  id={statusLabel[row.status]}
                                />
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
                      );
                    })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                labelDisplayedRows={() =>
                  `${rows.length} ${rows.length > 1 ? 'itens' : 'item'}`
                }
                labelRowsPerPage="Itens por página:"
                count={rows.length}
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
        <DeleteProfessional
          isOpen={dialog === 'delete'}
          handlerCloseDialog={handlerCloseDialog}
          handlerSuccessDialog={() => handlerDeleteUser(actingOn)}
        />
      </BoxWrapperDashboard>
    </section>
  );
};

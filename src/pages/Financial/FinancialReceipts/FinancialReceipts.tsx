import {
  Button,
  createStyles,
  InputBase,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  withStyles,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import { ChevronRight, FileChart } from 'mdi-material-ui';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { S3Api } from '../../../apis';
import { ScheduleApi } from '../../../apis/ScheduleApi';
import useAuth from '../../../hooks/useAuth';
import {
  IFilterSchedule,
  ISchedule,
  PaymentStatus,
  PaymentStatuses,
  SignFileResources,
} from '../../../libs';
import { getPaymentStatusMetadata } from '../../../utils/getPaymentStatusMetadata';
import { useFinancialReceiptsStyles } from './useFinancialReceiptsStyles';

const columns = [
  'financial.receipts.table.column.name',
  'financial.receipts.table.column.paymentData',
  'financial.receipts.table.column.status',
  'financial.receipts.table.column.value',
];

type TPaymentStatusObj = {
  color: string;
  text: string;
};

type TRenderPaymentLabel = Record<PaymentStatus, TPaymentStatusObj>;

type ISelectObject = {
  text: string;
  value: number;
};

type filterList = {
  year?: number;
  month?: number;
};

const months: Array<ISelectObject> = [
  { text: 'Janeiro', value: 0 },
  { text: 'Fevereiro', value: 1 },
  { text: 'Março', value: 2 },
  { text: 'Abril', value: 3 },
  { text: 'Maio', value: 4 },
  { text: 'Junho', value: 5 },
  { text: 'Julho', value: 6 },
  { text: 'Agosto', value: 7 },
  { text: 'Setembro', value: 8 },
  { text: 'Outubro', value: 9 },
  { text: 'Novembro', value: 10 },
  { text: 'Dezembro', value: 11 },
];

const BootstrapInput = withStyles(() =>
  createStyles({
    input: {
      border: 'none',
      fontSize: 16,
    },
  }),
)(InputBase);

interface Props {
  uuidUser?: string;
}

const FinancialReceipts: React.FC<Props> = ({ uuidUser }) => {
  const intl = useIntl();

  const { formatMessage } = intl;

  const classes = useFinancialReceiptsStyles();
  const today = new Date();
  const [rows, setRows] = useState<Array<ISchedule>>([]);
  const [financeData, setFinanceData] = useState<ISchedule[]>([]);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [total, setTotal] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<ISelectObject>(
    months[today.getMonth()],
  );
  const [selectedYear, setSelectedYear] = useState<ISelectObject>();
  const [years, setYears] = useState<Array<ISelectObject>>([]);

  const { currentUser } = useAuth();

  const initializeValues = (): Promise<any> => {
    return Promise.all([setRows([]), setPage(0), setRowsPerPage(10)]);
  };

  const getFinance = useCallback(
    async ({ year, month }: filterList) => {
      if (currentUser) {
        let dateFrom = today.setFullYear(year || new Date().getFullYear());

        dateFrom = new Date(dateFrom).setMonth(
          month || month || new Date().getMonth(),
        );
        dateFrom = new Date(dateFrom).setDate(1);
        const dateUntil = new Date(dateFrom).setMonth(
          new Date(dateFrom).getMonth() + 1,
        );

        let filter: IFilterSchedule = {
          page: 1,
          pageSize: 100,
          from: moment(dateFrom).format('YYYY-MM-DD'),
          until: moment(dateUntil).format('YYYY-MM-DD'),
        };

        if (currentUser.type === 'patient') {
          filter = { ...filter, patient: uuidUser || currentUser.uuid };
        } else {
          filter = { ...filter, professional: uuidUser || currentUser.uuid };
        }

        const data = await ScheduleApi.list(filter);
        const totalTemp = data
          .filter((d) => d.paymentStatus === 'paid')
          .reduce((subtotal, item) => {
            return subtotal + Number(item.chargedValue);
          }, 0);

        setTotal(totalTemp);
        setFinanceData(data);
        setRows(data);
      }
    },
    [currentUser],
  );

  const handleMonthChange = useCallback(
    async (event: React.ChangeEvent<{ value: unknown }>) => {
      getFinance({ month: event.target.value as number });
    },
    [currentUser],
  );

  const handleYearChange = useCallback(
    async (event: React.ChangeEvent<{ value: unknown }>) => {
      getFinance({ year: event.target.value as number });
    },
    [currentUser],
  );

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSendNF = useCallback(async (item, file) => {
    const { publicUrl } = await S3Api.upload({
      file,
      signature: {
        fileType: file.type,
        prefix: item.uuid,
        resource: SignFileResources.scheduleReceipt,
      },
    });

    await ScheduleApi.sendReceipt({
      uuid: item.uuid,
      url: publicUrl,
    })
      .then(() => {
        toast.success(
          formatMessage({ id: 'api.financilaReceipts.send.success' }),
        );
        getFinance({});
      })
      .catch(() => {
        toast.error(formatMessage({ id: 'api.financilaReceipts.send.error' }));
      });
  }, []);

  const getYears = (): any => {
    setYears([]);
    for (let i = 0; i <= 5; i += 1) {
      setYears((prevState: any) => [
        ...prevState,
        {
          value: Number(moment(new Date()).format('YYYY')) - i,
          text: Number(moment(new Date()).format('YYYY')) - i,
        },
      ]);
    }
  };

  const handleOpenReceipt = useCallback((url: string) => {
    window.open(url, '_blank', 'fullscreen=yes');
    return false;
  }, []);

  useEffect(() => {
    getFinance({});
  }, [currentUser]);

  useEffect(() => {
    initializeValues();
    getYears();
  }, []);

  useEffect(() => {
    setSelectedYear(years[0]);
  }, [years]);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <div className="w-full overflow-x-auto ">
      <div className="flex justify-between items-center bg-gray-50 rounded p-5 flex-wrap gap-4">
        <div className="flex-1 flex gap-4 justify-between xl:justify-start">
          <Select
            value={selectedMonth.value}
            input={<BootstrapInput />}
            onChange={handleMonthChange}>
            {months.map((month) => (
              <MenuItem
                onClick={() => setSelectedMonth(month)}
                value={month.value}
                key={month.text}>
                {month.text}
              </MenuItem>
            ))}
          </Select>
          {years.length && selectedYear && (
            <Select
              value={selectedYear.value}
              input={<BootstrapInput />}
              onChange={handleYearChange}>
              {years.map((year) => (
                <MenuItem
                  onClick={() => setSelectedYear(year)}
                  value={year.value}>
                  {year.text}
                </MenuItem>
              ))}
            </Select>
          )}
        </div>
        <div className="flex-1 flex flex-col items-end">
          <span className="text-sm text-gray-400 block">
            <FormattedMessage id="financial.receipts.monthTotal.label" />
          </span>
          <strong className="text-base block">
            {new Intl.NumberFormat('PT-br', {
              style: 'currency',
              currency: 'BRL',
            }).format(total)}
          </strong>
        </div>
      </div>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((columnIdName) => (
                <TableCell align="left">
                  <FormattedMessage id={columnIdName} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const metadata = getPaymentStatusMetadata({
                  status: row.paymentStatus,
                  intl,
                });

                return (
                  <TableRow key={row.uuid}>
                    <TableCell component="th" scope="row">
                      {row.patient.name}
                    </TableCell>
                    <TableCell align="left">
                      {row.paymentConfirmedAt
                        ? moment(row.paymentConfirmedAt).format('LL')
                        : '- - -'}
                    </TableCell>
                    <TableCell align="left">
                      <span
                        style={{
                          color: metadata.color,
                        }}>
                        {metadata.label}
                      </span>
                    </TableCell>
                    <TableCell align="left">
                      <span className="inline">
                        {new Intl.NumberFormat('PT-br', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(row.chargedValue)}
                      </span>
                      <div className="ml-2 inline">
                        {row.paymentStatus === PaymentStatuses.paid && (
                          <>
                            <input
                              accept="application/pdf"
                              className={classes.input}
                              id={`contained-button-file-${row.uuid}`}
                              type="file"
                              onChange={(event) => {
                                if (event.target.files) {
                                  handleSendNF(row, event.target.files[0]);
                                }
                              }}
                            />

                            {currentUser?.type === 'professional' && (
                              <label
                                htmlFor={`contained-button-file-${row.uuid}`}>
                                <Button color="secondary" component="span">
                                  <FileChart fontSize="small" />
                                  <FormattedMessage id="financial.receipts.table.column.value.sendReceipt" />
                                </Button>
                              </label>
                            )}
                          </>
                        )}

                        {row.receiptUrl && (
                          <label
                            htmlFor={`contained-button-file-${row.uuid}`}
                            onClick={() =>
                              handleOpenReceipt(row.receiptUrl as string)
                            }>
                            <Button color="primary" component="span">
                              <FormattedMessage id="financial.receipts.table.column.value.openReceipt" />
                              <ChevronRight fontSize="small" />
                            </Button>
                          </label>
                        )}
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
            `${rows.length} ${rows.length > 1 ? 'registros' : 'registro'}`
          }
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
      </TableContainer>
    </div>
  );
};

export default FinancialReceipts;

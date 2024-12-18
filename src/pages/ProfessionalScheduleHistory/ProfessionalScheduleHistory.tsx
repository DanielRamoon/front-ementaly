import { Button, Divider, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import throttle from 'lodash.throttle';
import { Magnify } from 'mdi-material-ui';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';

import { PatientApi, ScheduleApi } from '../../apis';
import { LoadingContainer, TitleDashboard } from '../../components';
import { IPatient, ISchedule, ScheduleQueryDTO } from '../../libs';
import { ScheduleItem } from '../ListSchedules/ScheduleItem';

interface ProfessionalScheduleHistoryProps {}

export const ProfessionalScheduleHistory: React.FC<ProfessionalScheduleHistoryProps> = (
  props,
) => {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [isLoading, setLoading] = useState(false);

  const [patient, setPatient] = useState<IPatient | null>(null);
  const [from, setFrom] = useState<moment.Moment | null>(null);
  const [until, setUntil] = useState<moment.Moment | null>(null);

  const [name, setName] = useState('');
  const [patients, setPatients] = useState<IPatient[]>([]);

  const [page, setPage] = useState(1);

  const lastIndex = React.useRef(0);

  const find = async (options: ScheduleQueryDTO): Promise<void> => {
    try {
      setLoading(true);

      const data = await ScheduleApi.find({
        ...options,
      });

      lastIndex.current = data.length - 1;

      setSchedules(data);
    } catch {
      // TODO display error msg
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const refresh = () => {
    find({
      from: from?.toISOString(true),
      until: until?.toISOString(true),
      patient: patient?.uuid,
      page,
      pageSize: 25,
    });
  };

  useEffect(() => {
    find({
      page,
      pageSize: 25,
    });
  }, []);

  const throttled = useCallback(throttle(PatientApi.find, 1000), []);

  const searchPatients = useCallback(
    async (search: string): Promise<void> => {
      try {
        const results = await throttled({
          search,
          page: 1,
          pageSize: 10,
        });

        setPatients(results || []);
      } catch {
        // TODO handle error
      }
    },
    [throttled],
  );

  useEffect(() => {
    if (!name.length) return;

    searchPatients(name);
  }, [name, searchPatients]);

  return (
    <>
      <TitleDashboard>Histórico de Atendimentos</TitleDashboard>
      <section className="p-2 md:p-8">
        <div className="bg-white lg:w-2/3 p-4 mb-6">
          <h2 className="font-bold text-lg mb-2">Filtros</h2>

          <Autocomplete
            options={patients}
            inputValue={name}
            onInputChange={(_, value) => setName(value)}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            getOptionSelected={(option) => {
              return option.uuid === patient?.uuid;
            }}
            onChange={(_, value) => setPatient(value)}
            loading={isLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                margin="normal"
                label="Paciente"
              />
            )}
          />

          <div className="flex">
            <KeyboardDatePicker
              value={from}
              fullWidth
              autoOk
              inputVariant="outlined"
              className="mr-2"
              variant="inline"
              margin="normal"
              format="DD/MM/YYYY"
              onChange={(date) => {
                setFrom(date as any);
              }}
              label="Data de Início"
              helperText="dd/mm/aaaa"
              style={{ marginRight: 16 }}
            />

            <KeyboardDatePicker
              value={until}
              inputVariant="outlined"
              className="mr-2"
              variant="inline"
              autoOk
              fullWidth
              margin="normal"
              format="DD/MM/YYYY"
              onChange={(date) => {
                setUntil(date as any);
              }}
              label="Data Limite"
              helperText="dd/mm/aaaa"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Magnify />}
              onClick={() => refresh()}>
              Buscar
            </Button>
          </div>
        </div>

        <div className=" bg-white lg:w-2/3 p-4 mr-8">
          <div className="p-6">
            <LoadingContainer loading={isLoading}>
              {schedules.map((schedule, index) => {
                return (
                  <div key={`schedule-${schedule.uuid}`}>
                    <ScheduleItem schedule={schedule} />

                    {index !== lastIndex.current && (
                      <div className="my-8">
                        <Divider />
                      </div>
                    )}
                  </div>
                );
              })}
            </LoadingContainer>
          </div>
        </div>
      </section>
    </>
  );
};

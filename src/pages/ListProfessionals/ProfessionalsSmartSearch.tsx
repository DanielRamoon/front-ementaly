import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import ReactGA from 'react-ga4';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ProfessionalType } from '../../libs/IProfessionalType';

type IQuote = {
  professionalType: number;
  checked: boolean;
  key: string;
};

interface IProfessionalSmartSearch {
  onClose: () => void;
  onSearchSubmit: (actAs: ProfessionalType[]) => void;
}

export const ProfessionalsSmartSearch: React.FC<IProfessionalSmartSearch> = ({
  onClose,
  onSearchSubmit,
}) => {
  const { formatMessage } = useIntl();
  const [quotesStep, setQuotesStep] = useState<number>(0);

  const [firstQuotes, setFirstQuotes] = useState<Array<IQuote>>([
    {
      key: 'quote1',
      professionalType: 0,
      checked: false,
    },
    {
      key: 'quote2',
      professionalType: 0,
      checked: false,
    },
    {
      key: 'quote3',
      professionalType: 0,
      checked: false,
    },
    {
      key: 'quote4',
      professionalType: 0,
      checked: false,
    },
    {
      key: 'quote5',
      professionalType: 0,
      checked: false,
    },
    {
      key: 'quote6',
      professionalType: 0,
      checked: false,
    },
    {
      key: 'quote7',
      professionalType: 0,
      checked: false,
    },
    {
      key: 'quote8',
      professionalType: 0,
      checked: false,
    },
    {
      key: 'quote9',
      professionalType: 0,
      checked: false,
    },
  ]);
  const [secondQuotes, setSecondQuotes] = useState<Array<IQuote>>([
    {
      key: 'quote10',
      professionalType: 0,
      checked: false,
    },
    {
      key: 'quote11',
      professionalType: 0,
      checked: false,
    },
    {
      key: 'quote12',
      professionalType: 1,
      checked: false,
    },
    {
      key: 'quote13',
      professionalType: 1,
      checked: false,
    },
    {
      key: 'quote14',
      professionalType: 1,
      checked: false,
    },
    {
      key: 'quote15',
      professionalType: 1,
      checked: false,
    },
    {
      key: 'quote16',
      professionalType: 1,
      checked: false,
    },
    {
      key: 'quote17',
      professionalType: 1,
      checked: false,
    },
    {
      key: 'quote18',
      professionalType: 1,
      checked: false,
    },
  ]);

  const handleChangeFirstQuotes = useCallback((event) => {
    const { name, checked } = event.target;
    setFirstQuotes(
      firstQuotes.filter((quote) => {
        if (quote.key === name) quote.checked = checked;
        return quote;
      }),
    );
  }, []);

  const handleChangeSecondQuotes = useCallback((event) => {
    const { name, checked } = event.target;
    setSecondQuotes(
      secondQuotes.filter((quote) => {
        if (quote.key === name) quote.checked = checked;
        return quote;
      }),
    );
  }, []);

  const onSubmit = useCallback(() => {
    const allQuotes = [...firstQuotes, ...secondQuotes];
    let psychiatristCount = 0;
    let psychologistCount = 0;

    allQuotes.map((quote) => {
      if (quote.checked) {
        if (quote.professionalType === 0) {
          psychiatristCount += 1;
        } else {
          psychologistCount += 1;
        }
      }
      return { psychiatristCount, psychologistCount };
    });

    if (psychiatristCount >= 1) {
      onSearchSubmit(['psychiatrist']);
    } else {
      onSearchSubmit(['psychologist']);
    }
  }, []);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const STEPS = [
    <FormGroup key="first-quotes-form-group">
      {firstQuotes.map((quote) => (
        <div className="border-gray-400 p-2 border-solid border rounded mb-6">
          <FormControlLabel
            key={quote.key}
            control={
              <Checkbox
                color="primary"
                checked={quote.checked}
                onChange={handleChangeFirstQuotes}
                name={quote.key}
              />
            }
            label={formatMessage({
              id: `professionals.smart.search.form.${quote.key}`,
            })}
          />
        </div>
      ))}
    </FormGroup>,
    <FormGroup key="second-quotes-form-group">
      {secondQuotes.map((quote) => (
        <div className="border-gray-400 p-2 border-solid border rounded mb-6">
          <FormControlLabel
            key={quote.key}
            control={
              <Checkbox
                color="primary"
                checked={quote.checked}
                onChange={handleChangeSecondQuotes}
                name={quote.key}
              />
            }
            label={formatMessage({
              id: `professionals.smart.search.form.${quote.key}`,
            })}
          />
        </div>
      ))}
    </FormGroup>,
  ];

  const renderFooterButton = [
    <>
      <Button onClick={() => onClose()} color="inherit">
        <FormattedMessage id="button.cancel" />
      </Button>
      <Button
        onClick={() => setQuotesStep((prevState) => prevState + 1)}
        key="smart-search-continue-button"
        variant="contained"
        color="primary">
        <FormattedMessage id="button.advance" />
      </Button>
    </>,
    <>
      <Button
        onClick={() => setQuotesStep((prevState) => prevState - 1)}
        color="inherit">
        <FormattedMessage id="button.return" />
      </Button>
      <Button
        onClick={() => onSubmit()}
        key="smart-search-complete-button"
        variant="contained"
        color="primary">
        <FormattedMessage id="button.conclude" />
      </Button>
    </>,
  ];

  return (
    <section>
      <div className="w-full">
        <span className="text-gray-500 text-base">
          <FormattedMessage id="professionals.smart.search.subtitle" />
        </span>

        <div className="my-6">
          <strong className="font-black text-base">
            <FormattedMessage id="professionals.smart.search.form.title" />
          </strong>
          <legend className="text-xs text-gray-500">
            <FormattedMessage id="professionals.smart.search.form.subtitle" />
          </legend>
        </div>
      </div>

      <FormControl className="w-full overflow-scroll h-72" component="fieldset">
        {STEPS[quotesStep]}
      </FormControl>

      <div className="flex justify-end gap-4 pt-6 w-full text-gray-500">
        {renderFooterButton[quotesStep]}
      </div>
    </section>
  );
};

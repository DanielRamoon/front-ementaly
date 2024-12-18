export function transformClassValidatorToFormikErrors(error: any) {
  if (
    error.response?.status === 400 &&
    Array.isArray(error.response?.data?.message)
  ) {
    const errors = error.response.data.message
      .filter((err: unknown) => typeof err === 'string')
      .map((err: string) => {
        if (err.startsWith('{')) return err;

        const [fieldName] = err.split(' ');

        return JSON.stringify({ property: fieldName });
      })
      .map((err: string) => JSON.parse(err))
      .reduce(
        (prev: any, next: any) => ({
          ...prev,
          [next.property]: 'Preenchimento Inválido',
        }),
        {} as any,
      );

    return errors;
  }

  return {};
}

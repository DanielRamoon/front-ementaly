interface IConpass {
  init: (options: { name: string; email: string; custom_fields: any }) => void;
}

declare const Conpass: IConpass;

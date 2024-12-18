type Events =
  | 'core:moduleInit'
  | 'core:moduleHide'
  | 'prescricaoImpressa'
  | 'viewPrescription';

declare interface ModuleInitEventPayload {
  name: Modules;
  build: string;
  version: string;
}

declare interface ModuleHideEventPayload {
  moduleName: string;
}

declare interface PrescriptionPrintingEventPayload {
  alterada: boolean;
  reimpressao: boolean;

  prescricao: {
    id: number;
    prescriptionUuid: string;
  };
}

type EventPayload = ModuleInitEventPayload &
  ModuleHideEventPayload &
  PrescriptionPrintingEventPayload;

interface MdEvent {
  add(event: Events, callback: (data: EventPayload) => void);
}

interface IMdSinapsePrescricao {
  event: MdEvent;
}

type Modules = 'plataforma.prescricao';

interface MdServer {
  unbindEvents: () => void;
}

interface MdModule {
  show(module: Modules);
}

type Commands = 'setPaciente' | 'setFeatureToggle';

interface SetPatientCommandPayload {
  nome: string;
  idExterno: string;

  endereco?: string;
  cidade?: string;
  telefone?: string;
  peso?: number;
  altura?: number;
  nome_mae?: string;
  dificuldade_locomocao?: boolean;
}

interface SetFeatureTogglePayload {
  deletePatient: boolean;
  removePatient: boolean;
  historyPrescription?: boolean;
  newPrescription?: boolean;
  optionsPrescription?: boolean;
  removePrescription?: boolean;
  editPatient?: boolean;
  setPatientAllergy?: boolean;
  autocompleteExams?: boolean;
  autocompleteIndustrialized?: boolean;
  autocompleteManipulated?: boolean;
  autocompleteCompositions?: boolean;
  autocompletePeripherals?: boolean;
  copyMedicalRecords?: boolean;
  buttonClose?: boolean;
  newFormula?: boolean;
}

type CommandPayload = SetPatientCommandPayload | SetFeatureTogglePayload;

interface MdCommand {
  send(
    module: Modules,
    command: Commands,
    payload: CommandPayload,
  ): Promise<void>;
}

interface IMdHub {
  server: MdServer;
  module: MdModule;

  event: MdEvent;

  command: MdCommand;
}

declare const MdSinapsePrescricao: IMdSinapsePrescricao;

declare const MdHub: IMdHub;

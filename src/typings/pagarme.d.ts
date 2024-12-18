declare module 'pagarme' {
  interface PagarMeClient {
    connect: (options: ConnectOptions) => Promise<PagarMeClient>;

    security: SecurityResource;
    recipients: RecipientResource;
    transactions: TransactionResource;
    customers: CustomerResource;
    bankAccounts: BankAccountResource;
    transfers: TransferResource;
    cards: CardResource;
  }

  interface CustomerResource {
    create: (
      dto: Customer,
    ) => Promise<PagarMeResponseObject<'customer', Customer>>;
  }

  interface TransferResource {
    create: (
      dto: TransferDTO,
    ) => Promise<PagarMeResponseObject<'transfer', TransferDTO>>;
  }

  interface TransferDTO {
    amount: number;
    recipient_id: string;
    metadata?: any;
  }

  interface SecurityResource {
    encrypt: (dto: CardDTO) => Promise<string>;
  }

  interface CardResource {
    create: (
      dto: CardDTO | { card_hash: string },
    ) => Promise<PagarMeResponseObject<'card', CardDTO>>;

    all: (options: {
      customer_id: any;
    }) => Promise<Array<PagarMeResponseObject<'card', CardDTO>>>;
  }

  interface CardDTO {
    card_id?: string;
    card_number: string;
    card_holder_name: string;
    card_expiration_date: string;
    card_cvv: string;
    customer_id?: string;
  }

  interface TransactionResource {
    create: (
      dto: TransactionDTO,
    ) => Promise<PagarMeResponseObject<'transaction', TransactionDTO>>;

    refund: ({
      id: number,
    }) => Promise<PagarMeResponseObject<'transaction', TransactionDTO>>;
  }

  interface RecipientResource {
    create: (
      dto: RecipientDTO,
    ) => Promise<PagarMeResponseObject<'recipient', RecipientDTO>>;

    find: (options?: {
      id: string;
    }) => Promise<PagarMeResponseObject<'recipient', RecipientDTO>>;
  }

  interface BankAccountResource {
    create: (dto: BankAccountDTO) => Promise<void>;
  }

  type BankAccountType =
    | 'conta_corrente'
    | 'conta_poupanca'
    | 'conta_corrente_conjunta'
    | 'conta_poupanca_conjunta';

  interface BankAccountDTO {
    bank_code: string;
    agencia: string;
    agencia_dv?: string;
    conta: string;
    type: BankAccountType;
    conta_dv: string;
    document_number: string;
    /** Max of 30 characters */
    legal_name: string;
  }

  type TransactionPaymentMethod = 'credit_card' | 'boleto';

  interface Customer {
    name: string;
    email: string;
    document_number: string;
    address: {
      street: string;
      street_number: string;
      neighborhood: string;
      zipcode: string;
      city?: string;
      state?: string;
    };
    phone: {
      ddd: string;
      number: string;
    };
  }

  type TransactionStatus =
    | 'processing'
    | 'authorized'
    | 'paid'
    | 'refunded'
    | 'waiting_payment'
    | 'pending_refund'
    | 'refused'
    | 'chargedback'
    | 'analyzing'
    | 'pending_review';

  interface BaseTransactionDTO {
    id?: number;

    amount: number;
    payment_method: TransactionPaymentMethod;
    postback_url?: string;
    async?: boolean;
    card_hash?: string;
    installments?: number;
    capture?: string;
    split_rules?: SplitRule[];
    customer: Customer;
    metadata?: any;
    reference_key?: string;
    local_time?: string;
  }

  interface CreditCardTransactionDTO extends Partial<CardDTO> {
    soft_descriptor?: string;
  }

  interface BoletoTransactionDTO {
    boleto_expiration_date?: string;
    boleto_instructions?: string;
    boleto_url?: string;
    boleto_barcode?: string;
  }

  type TransactionDTO = BaseTransactionDTO &
    CreditCardTransactionDTO &
    BoletoTransactionDTO;

  interface PlanDTO {
    amount: number;
    days: number;
    name: string;
    trial_days?: number;
    payment_methods?: TransactionPaymentMethod[];
    color?: string;
    charges: number | null;
    installments?: number;
    invoice_reminder?: number;
  }

  interface RecipientDTO {
    anticipatable_volume_percentage?: number;
    automatic_anticipation_enabled?: boolean;
    transfer_enabled?: boolean;
    transfer_interval?: TransferInterval;
    transfer_day?: number;
    postback_url?: string;
    metadata?: any;
    register_information?: RegisterInformationPF | RegisterInformationPJ;
    bank_account: BankAccountDTO;
    bank_account_id?: string;
  }

  type RegisterInformationPF = RegisterInformation & {
    type: 'individual';
    name: string;
  };

  type RegisterInformationPJ = RegisterInformation & {
    type: 'corportaion';
    company_name: string;
    managing_partners: Array<{
      type: 'individual';
      document_number: string;
      email: string;
      name: string;
    }>;
  };

  type RegisterInformation = {
    email: string;
    document_number: string;
    site_url?: string;
    phone_numbers?: Array<{ ddd: string; number: string; type: string }>;
  };

  type TransferInterval = 'daily' | 'weekly' | 'monthly';

  interface ConnectOptions {
    api_key?: string;
    email?: string;
    password?: string;
    encryption_key?: string;
  }

  export type PagarMeResponseObject<T, D> = D & {
    id: string;
    object: T;
  };

  interface SplitRule {
    liable?: boolean;
    charge_processing_fee?: boolean;
    percentage?: number;
    amount?: number;
    charge_remainder_fee?: boolean;
    recipient_id: string;
  }

  type PostbackStatus =
    | 'processing'
    | 'waiting_retry'
    | 'pending_retry'
    | 'failed'
    | 'success';

  type PostbackModel = 'transaction' | 'subscription' | 'recipient';

  interface Postback {
    object: 'postback';
    status: PostbackStatus;
    model: PostbackModel;
    model_id: string;
    headers: string;
    /**
     * Recebido como query string. Formato disponível em PostbackPayload
     */
    payload: string;
    request_url: string;
    retries: number;
    next_retry: string;
    deliveries: PostbackDelivery;
    date_created: string;
    date_updated: string;
    signature: string;
    id: string;
  }

  type PostbackPayloadEvent =
    | 'transaction_status_changed'
    | 'subscription_status_changed'
    | 'recipient_status_changed'
    | 'transaction_created';

  interface PostbackPayload {
    id: string;
    fingerprint: string;
    event: PostbackPayloadEvent;
    old_status: string;
    desired_status: string;
    current_status: string;
    object: PostbackModel;

    transaction?: TransactionDTO;
    subscription?: unknown;
    recipient?: unknown;
  }

  type PostbackDeliveryStatus = 'processing' | 'failed' | 'success';
  type PostbackStatusReason = 'http_status_code' | 'null';

  interface PostbackDelivery {
    object: 'postback_delivery';
    status: PostbackDeliveryStatus;
    status_reason: PostbackStatusReason;
    status_code: string;
    response_time: number;
    response_headers: string;
    response_body: string;
    date_created: string;
    date_updated: string;
    id: string;
  }

  interface PostbackHelpers {
    calculateSignature(apiKey: string, payload: string): string;

    verifySignature(
      apiKey: string,
      payload: string,
      hashedPayload: string,
    ): boolean;
  }

  const client: PagarMeClient;
  const postback: PostbackHelpers;
}

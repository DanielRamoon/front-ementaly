export default {
  scheduleNotStarted: 'Você não iniciou esse atendimento',
  invalidStatus: 'Status do atendimento inválido',
  invalidPaymentStatus:
    'O pagamento desse atendimento ainda não foi confirmado',
  professionalNotAvailable:
    'O profissional não está mais disponível nesse horário',
  patientNotInsertedOnDatabase:
    'Ocorreu um erro ao inserir o paciente na base de dados, favor entrar em contato com o suporte',
  objectNotFound: 'Objeto não encontrado [{resource}]',

  minScheduleChargedValue: 'Valor mínimo por consulta é de R$ 60,00',

  notLinkedToPatient: 'Você não pode visualizar os dados desse paciente',

  missingPatientProfile:
    'Antes de fazer um agendamento você precisa preencher os dados seu perfil',

  'auth.wrongMethod':
    'Essa conta usa outra forma de autenticação. Tente: {availableMethods}',
  'auth.signInMethod_google.com': 'Entrar com Gmail',
  'auth.signInMethod_password': 'Email e Senha',

  'login.title': 'Faça login com a sua conta',
  'login.forgetPassword': 'Esqueceu a senha?',
  'login.createAccount': 'Criar conta',

  'rejectProfessionalDialog.title': 'Recusar Perfil do Profissional',

  'rejectProfessionalDialog.input.reason.label': 'Motivo da Recusa',
  'rejectProfessionalDialog.input.reason.placeholder':
    'Descreva o motivo da recusa detalhadamente para que o profissional possa realizar as alterações necessárias',

  'rejectProfessionalDialog.button.cancel': 'Cancelar',
  'rejectProfessionalDialog.button.confirm': 'Rejeitar Perfil',
  'rejectProfessionalDialog.rejected': 'Esse perfil não foi aprovado',

  'userType.patient': 'Paciente',
  'userType.professional': 'Profissional',
  'userType.admin': 'Administrador',
  'userType.guest': 'Convidado',

  'professionalType.psychiatrist.label': 'Psiquiatra',
  'professionalType.psychologist.label': 'Psicólogo',
  'profileType.waiting.label': 'Aguardando Aprovação',
  'profileType.verified.label': 'Verificado',
  'profileType.rejected.label': 'Não Aprovado',
  'profileType.active.label': 'Ativo',
  'profileType.inactive.label': 'Bloqueado',
  'profileType.missing.label': 'Perfil não Preenchido',
  'profileType.incomplete.label': 'Perfil Incompleto',

  'professionalProfile.title': 'Perfil do Profissional',
  'professionalProfile.infoPayment': 'Informações sobre Pagamento',
  'professionalProfile.socialMedia': 'Redes Sociais',
  'professionalProfile.linkedin': 'Linkedin',
  'professionalProfile.facebook': 'Facebook',
  'professionalProfile.instagram': 'Instagram',
  'professionalProfile.externalUrl': 'Link Externo',
  'professionalProfile.rejectionReason.title': 'Seu perfil não foi aprovado',
  'professionalProfile.rejectionReason.details': 'Motivo da Recusa do Perfil',
  'professionalProfile.rejectionReason.description':
    'Verifique os feedbacks fornecedos pelos nossos avaliadores, faça as correções necessárias e solicite aprovação novamente',
  'professionalProfile.status': 'Status do Perfil:',
  'professionalProfile.addEducation': 'Adicionar Formação Acadêmica',
  'professionalProfile.button.settings': 'Acessar Perfil',
  'professionalProfile.missingSettings':
    'Para começar a receber atendimentos você deve preencher todos os dados do perfil, conta bancária, agenda e enviar para aprovação',
  'professionalProfile.professional.psychologist': 'Psicólogo',
  'professionalProfile.professional.psychiatrist': 'Médico',
  'professionalProfile.checked': 'Verificado',
  'professionalProfile.amount': 'Preço',
  'professionalProfile.duration': 'Duração da sessão',
  'professionalProfile.canIHelpYou': 'Posso te ajudar com',
  'professionalProfile.attendanceText': 'Atende',
  'professionalProfile.attendance.adult': 'Adultos',
  'professionalProfile.attendance.elderly': 'Idosos',
  'professionalProfile.attendance.child': 'Crianças',
  'professionalProfile.academicFormation': 'Formação Acadêmica',
  'professionalProfile.aboutMe': 'Sobre mim',
  'professionalProfile.deleteAccount': 'Remover conta',
  'professionalProfile.listWeek': 'Agenda da semana',
  'professionalProfile.availableTimes': 'Horários disponíveis',
  'professionalProfile.button.edit': 'Editar',
  'professionalProfile.button.cancel': 'Cancelar',
  'professionalProfile.button.editWeekCalendar':
    'Editar horários de atendimento',
  'professionalProfile.button.approve': 'Aprovar',
  'professionalProfile.button.reject': 'Rejeitar',
  'professionalProfile.button.chat': 'Chat',
  'professionalProfile.button.whatsapp': 'WhatsApp',
  'professionalProfile.button.adminWhatsapp': 'Iniciar uma conversa...',
  'professionalProfile.button.readyForApproval': 'Solicitar Aprovação',
  'professionalProfile.button.waitingForApproval': 'Aguardando Aprovação',
  'professionalProfile.email': 'Email',
  'professionalProfile.whatsapp': 'WhatsApp',
  'professionalProfile.showWhatsapp': 'Exibir WhatsApp para os pacientes?',
  'professionalProfile.beforeSettingWorkingSchedule':
    'Para editar a agenda você precisa antes preencher os dados do seu perfil',

  'professionalProfileApprovalDialog.title': 'Solicitar Aprovação do Perfil',
  'professionalProfileApprovalDialog.description':
    'Antes de solicitar a aprovação do seu perfil, certifique-se de ter preenchido todos os dados do seu perfil, principalmente o seu CRP e/ou CRM, lembre-se de cadastrar sua conta bancária e configurar os seus horários de atendimento na agenda',
  'professionalProfileApprovalDialog.button.cancel': 'Cancelar',
  'professionalProfileApprovalDialog.button.submit': 'Enviar para Aprovação',

  'professionalProfileWaitingApprovalDialog.title':
    'Perfil Aguardando Aprovação',
  'professionalProfileWaitingApprovalDialog.description':
    'O processo de avaliação do seu perfil é feito de forma manual por um administrador da E-mentaly, todos os dados por você informado são validados junto aos órgãos de Psicologia e Psiquiatria, após o envio o tempo de aprovação é de até 72 horas, qualquer dúvida entre em contato pelo e-mail: suporte@ementaly.com',

  'administrative.professionals.title': 'Usuários',
  'administrative.professionals.containerTitle': 'Profissionais',
  'administrative.professionals.add.button': 'Convidar',
  'administrative.professionals.search.button': 'Pesquisar',
  'administrative.professionals.table.column.professional': 'Profissional',
  'administrative.professionals.table.column.level': 'Nivel',
  'administrative.professionals.table.column.lastactivity': 'Última atividade',
  'administrative.professionals.table.column.servicesMade':
    'Consultas Realizadas',
  'administrative.professionals.table.column.accountstatus': 'Status',

  'administrative.patients.title': 'Usuários',
  'administrative.patients.containerTitle': 'Pacientes',
  'administrative.patients.add.button': 'Convidar Paciente',
  'administrative.patients.search.button': 'Pesquisar',
  'administrative.patients.table.column.patient': 'Paciente',
  'administrative.patients.table.column.email': 'E-mail',
  'administrative.patients.table.column.phone': 'Telefone',
  'administrative.patients.table.column.age': 'Idade',
  'administrative.patients.table.column.lastAccess': 'Último acesso',
  'administrative.patients.table.column.status': 'Status',

  'userDetailsDialog.title': 'Detalhes do Usuário',
  'userDetailsDialog.name': 'Nome Completo',
  'userDetailsDialog.email': 'Email',
  'userDetailsDialog.type': 'Tipo de Usuário',
  'userDetailsDialog.lastSignIn': 'Último Acesso',

  'financial.receipts.title': 'Financeiro',
  'financial.receipts.subtitle': 'Lista de pagamentos',
  'financial.receipts.addCard.button': 'Adicionar cartão',
  'financial.receipts.monthTotal.label': 'Total',
  'financial.receipts.table.column.name': 'Nome',
  'financial.receipts.table.column.paymentData': 'Data do pagamento',
  'financial.receipts.table.column.status': 'Status',
  'financial.receipts.table.column.value': 'Valor',
  'financial.receipts.table.column.value.openReceipt': 'Abrir NF',
  'financial.receipts.table.column.value.sendReceipt': 'Upload NF',

  'financial.registered.title': 'Cadastrados',

  'signup.title': 'Crie a sua conta para realizar o login',
  'signup.subtitleProfessional':
    'Como profissional você pode fazer atendimentos e aumentar sua base de pacientes. Os primeiros 30 dias são GRATUITOS. Depois será cobrada uma mensalidade de R$ 29,90.',
  'signup.subtitlePatient':
    'Conte com profissionais altamente qualificados para te ajudarem. Em segundos você cria sua conta gratuita e marca sua consulta com o profissional que escolher!',
  'signup.hasAccount': 'Já tem uma conta?',
  'signup.toast.success': 'Cadastro realizado com sucesso',
  'signup.toast.erros.auth/email-already-in-use':
    'E-mail já cadastrado em nossa base',

  'patientProfile.title': 'Perfil Paciente',
  'patientProfile.tab.profile': 'Perfil',
  'patientProfile.tab.scheduling': 'Agendamentos',
  'patientProfile.tab.chat': 'Chat',
  'patientProfile.tab.medicalRecord': 'Prescrições',
  'patientProfile.tab.prescriptions': 'Prescrições Anteriores',
  'patientProfile.tab.finances': 'Financeiro',
  'patientProfile.tab.clinicalFollowUp': 'Folha de Evolução',
  'patientProfile.button.addClinicalFollowUp': 'Nova Folha de Evolução',
  'patientProfile.memed': 'Prescrição',
  'patientProfile.profile': 'Perfil',
  'patientProfile.button.chat': 'Chat',
  'patientProfile.button.anamnese': 'Anamnese',
  'patientProfile.button.edit': 'Editar',
  'patientProfile.button.uploadPic': 'Alterar Foto de Perfil',

  'listPrescription.header.professional': 'Profissional',
  'listPrescription.header.date': 'Data',
  'listPrescription.button.download': 'Visualizar',

  'signin.title': 'Crie a sua conta',
  'signin.hasAccount': 'Já tem uma conta?',

  'forgetPassword.title': 'Recuperar Senha',
  'forgetPassword.description':
    'Esqueceu sua senha ? insira o seu email abaixo que enviaremos um email com as instruções para que possa recuperá-la',
  'forgetPassword.gotToLogin': 'Ir para login',
  'forgetPassword.toast.success': 'Solicitação enviada com sucesso',
  'forgetPassword.toast.error':
    'Não foi possível realizar seu acesso, tente novamente',

  'listProfessionals.title': 'Profissionais',
  'listProfessionals.button.smart-search': 'Busca inteligente',
  'listProfessionals.button.filter': 'Filtro',
  'listProfessionals.button.warning': 'Sinais de Alerta',
  'listProfessionals.subtitle': 'Profissionais recomendados',
  'listProfessionals.psychologist': 'Psicologia',
  'listProfessionals.psychiatrist': 'Psiquiatria',
  'listProfessionals.search.placeholder':
    'Procure por sintomas ou nome do profissional',

  'listProfessionals.button.psychologist': 'Ver Psiscólogos',
  'listProfessionals.button.psychiatrist': 'Ver Psiquiatras',

  'text.professional': 'Profissão',
  'txt.typeHere': 'Digite aqui',
  'txt.amountSymbol': 'R$',
  'txt.hourText': 'hora',
  'txt.minuteText': 'minutos',

  'field.age': 'Idade',

  'field.facebook': 'Link do Facebook',
  'field.instagram': 'Link do Instagram',
  'field.whatsapp': 'Número do WhatsApp (Somente números)',
  'field.linkedin': 'Link do LinkedIn',
  'field.externalUrl': 'Link Externo',

  'field.phone': 'Telefone',
  'field.phone.error.required': 'Por favor, preencha o telefone',

  'field.document': 'CPF',
  'field.documentNumber': 'CPF',
  'field.document.error.required': 'Por favor, preencha o documento',
  'field.documentNumber.error.required': 'Por favor, preencha o documento',

  'field.birthDate': 'Data de nascimento',
  'field.birthDate.error.required': 'Por favor, preencha a data de nascimento',

  'field.name': 'Nome',
  'field.name.error.required': 'Por favor, preencha o nome',

  'field.email': 'Email',
  'field.email.error': 'Por favor insira um e-mail válido',
  'field.email.error.required': 'Por favor, preencha o email',

  'field.password': 'Senha',
  'field.password.error.required': 'Por favor, preencha a senha',

  'field.crm': 'CRM',
  'field.crm.error.required': 'Por favor, preencha seu código profissional',

  'field.crp': 'CRP',
  'field.crp.error.required': 'Por favor, preencha seu código profissional',

  'field.charges': 'Preço',
  'field.charges.error.required': 'Por favor, preencha seu preço',

  'field.sessionDuration': 'Duração da sessão (minutos)',
  'field.sessionDuration.error.required':
    'Por favor, preencha a duração da sessão',

  'field.professional': 'Profissão',
  'field.professional.error.required': 'Por favor, preencha a profissão',

  'field.titleCourse': 'Título do curso',
  'field.titleCourse.error.required': 'Por favor, preencha o título do curso',

  'field.descriptionCourse': 'Descrição do curso',
  'field.descriptionCourse.error.required':
    'Por favor, preencha a descrição do curso',

  'field.yearFrom': 'Ano de ínicio',
  'field.yearFrom.error.required': 'Por favor, preencha o ano de ínicio',

  'field.yearUntil': 'Ano de termino',

  pleaseWait: 'Estamos processando sua requisição. Por favor aguarde...',
  saved: 'Requisição processada com sucesso',

  'selectAccountType.title': 'Como você gostaria de acessar o E-mentaly?',
  'selectAccountType.professional.title': 'Profissional',
  'selectAccountType.button.submit': 'Confirmar',
  'selectAccountType.professional.description':
    'Como profissional você pode fazer atendimentos e aumentar sua base de pacientes. Os primeiros 30 dias são GRATUITOS. Depois será cobrada uma mensalidade de R$ 29,90.',

  'selectAccountType.patient.title': 'Paciente',
  'selectAccountType.patient.description':
    'Conte com profissionais altamente qualificados para te ajudarem. Em segundos você cria sua conta gratuita e marca sua consulta com o profissional que escolher!',

  'button.confirm': 'Confirmar',
  'button.enter': 'Entrar',
  'button.enter.gmail': 'Entrar com Gmail',
  'button.send': 'Enviar',
  'button.search': 'Buscar',
  'button.showMore': 'Ver Mais',
  'button.save': 'Salvar',
  'button.cancel': 'Cancelar',
  'button.advance': 'Avançar',
  'button.conclude': 'Concluir',
  'button.return': 'Voltar',
  'button.approve': 'Aprovar',
  'button.delete': 'Deletar',
  'button.block': 'Bloquear',
  'button.showProfile': 'Ver Perfil',
  'button.done.professional.smart.search':
    ' Profissionais que selecionamos para você',

  'notifications.title': 'Notificações',
  'notifications.readNotificationError':
    'Não foi possível obter suas notificações. Tente novamente',
  'loadingContainer.loading': 'Carregando...',
  'loadingContainer.empty': 'Nenhum resultado a ser exibido',
  'chat.title': 'Chat',
  'chatFileInput.uploadError': 'Houve um erro ao enviar os arquivos',
  'chatMessage.downloadMedia': 'Fazer Download do Arquivo',
  'chat.button.start': 'Iniciar Conversa',
  'chat.start.title': 'Nenhuma mensagem por aqui',
  'chat.start.description':
    'Você pode iniciar uma conversa com essa pessoa clicando no botão abaixo',

  'api.profile.create.save': 'Perfil atualizado com sucesso',
  'api.profile.update.save': 'Perfil atualizado com sucesso',
  'api.profile.education.create': 'Curso adicionado com sucesso',
  'api.profissional.approve.success': 'Profissional aprovado com sucesso',
  'api.profissional.approve.error':
    'Não foi possível aprovar profissional, entre em contato com o suporte',
  'api.administrative.toast.deleteUser.success': 'Usuário removido com sucesso',

  'api.configureSchduleCalendar.update.success': 'Agenda salva',
  'api.configureSchduleCalendar.update.error':
    'Ocorreu um erro ao tentar salvar sua agenda',

  'api.anamnese.save.success': 'Anamese salva com sucesso',
  'api.anamnese.save.error': 'Houve um erro ao salvar a anamnese',

  'dialogs.professional.aprove.title': 'Aprovação de cadastro',
  'dialogs.professional.aprove.description':
    'Você deseja aprovar esse profissional? Após sua aprovação ele poderá realizar suas consultas pela plataforma',
  'dialogs.professional.aprove.checklist': 'Checklist do Profissional',
  'dialogs.professional.aprove.checklist.item.hasProfile':
    'O perfil foi preenchido?',
  'dialogs.professional.aprove.checklist.item.hasBankAccount':
    'A conta bancária foi preenchida?',
  'dialogs.professional.aprove.checklist.item.hasWorkingSchedule':
    'Pelo menos 1 horário da agenda foi habilitado?',
  'dialogs.professional.aprove.forceApprove':
    'Quero aprovar esse profissional, ainda que um ou mais itens do checklist não estejam preenchidos',
  'professionals.error':
    'Houve um erro ao identificar os profissionais que você está contectado',
  'trialExpiredDialog.title': 'Período de testes expirado!',
  'trialExpiredDialog.titleNotTrial': 'Assinatura expirada!',
  'trialExpiredDialog.text': 'O período de teste gratuíto da sua conta acabou.',
  'trialExpiredDialog.textNotTrial':
    'A assinatura da sua conta acabou. Não perca seu acesso, renove a assinatura agora mesmo!',
  'trialExpiredDialog.button': 'Assinar o E-mentaly!',
  'trialExpiredDialog.continue': 'Renove a sua assinatura',
  'createScheduleDialog.title': 'Adicionar Atendimento',
  'createScheduleDialog.cancel': 'Cancelar',
  'createScheduleDialog.confirm': 'Confirmar',
  'createScheduleDialog.field.isNewPatient': 'É um novo paciente',
  'createScheduleDialog.field.isExistentPatient': 'Paciente já existente',
  'createScheduleDialog.field.patient': 'Paciente',
  'createScheduleDialog.field.date.label': 'Início do Curso',
  'createScheduleDialog.field.date2.label': 'Data do Atendimento',
  'createScheduleDialog.field.date.placeholder': 'DD/MM/AAAA',
  'createScheduleDialog.field.date.start.label': 'Inicio do curso',
  'createScheduleDialog.field.date.end.label': 'Término do curso',
  'createScheduleDialog.field.startingAt.label': 'Início',
  'createScheduleDialog.field.endingAt.label': 'Término',
  'createScheduleDialog.field.chargedValue.label': 'Valor',
  'createScheduleDialog.field.date.format': 'DD/MM/YYYY',
  'createScheduleDialog.validation.patient': 'Selecione um paciente da lista',
  'createScheduleDialog.field.fulfillment.label':
    'Como o atendimento será realizado?',

  'createScheduleDialog.field.fulfillment.online': 'Online (Pela Plataforma)',
  'createScheduleDialog.field.fulfillment.inPerson': 'Presencial',

  'createScheduleDialog.field.billingStrategy.label':
    'Como será feito o pagamento por esse atendimento?',
  'createScheduleDialog.field.billingStrategy.payNow':
    'Antes do Atendimento (Pela Plataforma)',
  'createScheduleDialog.field.billingStrategy.payLater':
    'Depois do Atendimento (Você receberá do paciente diretamente)',

  'createScheduleDialog.field.recurrence.label': 'Plano de Atendimento',

  'createScheduleDialog.field.recurrenceUntil.format': 'DD/MM/YYYY',
  'createScheduleDialog.field.recurrenceUntil.placeholder': 'DD/MM/AAAA',
  'createScheduleDialog.field.recurrenceUntil.label': 'Recorrente até',
  'createScheduleDialog.field.recurrenceUntil.helperText':
    'Serão criados atendimentos automaticamente até essa data',

  'createScheduleDialog.field.recurrence.options.none': 'Nenhum',
  'createScheduleDialog.field.recurrence.options.oneWeek': 'A cada 1 Semana',
  'createScheduleDialog.field.recurrence.options.twoWeeks': 'A cada 2 Semanas',
  'createScheduleDialog.field.recurrence.options.oneMonth': 'A cada 1 mês',
  'createScheduleDialog.field.recurrence.options.other': 'Outro',
  'createScheduleDialog.field.recurrence.options.other.label':
    'Semanas entre os atendimentos',

  'createScheduleDialog.field.recurrence.options.other.endAdornment': 'Semanas',

  'validation.required': 'Preencha esse campo',
  'validation.positive': 'Esse número deve ser maior que zero',
  genericError: 'Houve um erro ao processar a requisição',
  badRequest: 'Verifique o preenchimento das informações',

  'scaffold.newSchedule': 'Novo Atendimento',
  'scaffold.upgradePlan': 'Assinar!',
  'scaffold.trialText':
    'Você tem {days} dias restantes \n do período de testes.',
  'scaffold.trialTextExpired': 'O seu período de testes expirou!',
  'scaffold.logout': 'Sair',
  'scaffold.termsOfUse': 'Termos de Uso',
  'scaffold.navigation': 'NAVEGAÇÃO',

  'scheduleItem.startingAt.format': 'DD [de] MMM [de] HH:mm',
  'scheduleItem.endingAt.format': '[às] HH:mm',
  'scheduleItem.fulfillment.online': 'Atendimento via E-mentaly',
  'scheduleItem.recurrence.single': 'Agendamento único',
  'scheduleItem.recurrence.multiple':
    'A cada {recurrence} semana(s) até {recurrenceUntil}',

  'checkout.title': 'Agendamento',
  'checkout.subtitle': 'Confirmar e pagar',
  'checkout.group.card.personal.title': 'Dados Pessoais',
  'checkout.field.name.label': 'Nome Completo',
  'checkout.field.phoneNumber.label': 'Telefone',
  'checkout.group.card.title': 'Dados do Cartão',
  'checkout.field.card.holderName.label': 'Nome no Cartão',
  'checkout.field.card.documentNumber.label': 'CPF do dono do cartão',
  'checkout.field.card.cardNumber.label': 'Número do Cartão',
  'checkout.field.card.cardNumber.placeholder': '4242 4242 4242 4242',
  'checkout.field.card.expirationDate.label': 'Validade',
  'checkout.field.card.cvv.label': 'Cód. Segurança',
  'checkout.field.card.saveCard': 'Salvar cartão para compras futuras',

  'checkout.group.card.billingAddress.title': 'Endereço da Fatura do Cartão',
  'checkout.field.address.zipcode.label': 'CEP',
  'checkout.field.address.street.label': 'Logradouro',
  'checkout.field.address.streetNumber.label': 'Nº',
  'checkout.field.address.neighborhood.label': 'Bairro',
  'checkout.field.address.city.label': 'Cidade',
  'checkout.field.address.state.label': 'Estado',
  'checkout.button.submit': 'Confirmar Atendimento',
  'checkout.existingCard': 'Cartões Já Cadastrados',
  'checkout.newCard': 'Usar um Novo Cartão',
  'checkout.scheduleIsPaid':
    'Você não precisa realizar o pagamento por esse agendamento no momento',

  'checkout.zipcodeError': 'Houve um erro ao consultar o CEP',
  'checkout.cardError':
    'Houve um erro ao processar o pagamento, favor entrar em contato com a operadora',
  'checkout.searchZipcode': 'Buscar CEP',
  'checkout.billingAddressError': 'Preencha o endereço da fatura do cartão',

  'checkout.requestProcessed':
    'Solicitação recebida. O pagamento está sendo processado',

  'checkout.error.urlParams':
    'Verifique o profissional e os horários selecionados',
  'checkout.cannotActOnSchedule':
    'Não é possível realizar checkout para esse agendamento',

  'configureBankAccount.field.legalName.label': 'Nome Completo',
  'configureBankAccount.field.documentNumber.label': 'CPF/CNPJ',
  'configureBankAccount.field.agency.label': 'Agência',
  'configureBankAccount.field.agencyDigit.label': 'Ag. Dígito',
  'configureBankAccount.field.account.label': 'Conta',
  'configureBankAccount.field.accountDigit.label': 'CC. Dígito',
  'configureBankAccount.field.bankCode.label': 'Banco',
  'configureBankAccount.field.type.label': 'Tipo de Conta',
  'configureBankAccount.button.submit.label': 'Confirmar',
  'configureBankAccount.button.cancel.label': 'Cancelar',
  'configureBankAccount.info':
    'Você receberá o valor devido pelos atendimentos realizados na plataforma através dessa conta bancária',

  'professionalPayment.title': 'Assinatura',
  'professionalPayment.button.submit': 'Confirmar Assinatura!',
  'professionalPayment.button.renew': 'Renovar Assinatura!',

  'bankAccountTypes.conta_corrente': 'Conta Corrente',
  'bankAccountTypes.conta_corrente_conjunta': 'Conta Corrente Conjunta',
  'bankAccountTypes.conta_poupanca': 'Conta Poupança',
  'bankAccountTypes.conta_poupanca_conjunta': 'Conta Poupança Conjunta',

  'professionalSchedule.title': 'Agenda',
  'professionalSchedule.legends.active': 'Aguardando Pagamento',
  'professionalSchedule.legends.inactive': 'Cancelado',
  'professionalSchedule.legends.confirmed': 'Agendamento Confirmado',
  'professionalSchedule.legends.completed': 'Agendamento Finalizado',
  'professionalSchedule.history': 'Histórico',

  'api.update.user.error': 'Houve um erro ao alterar seus dados',

  'cancelScheduleDialog.title': 'Cancelar Atendimento',
  'cancelScheduleDialog.viewProfile': 'Ver Perfil',
  'cancelScheduleDialog.professional': 'Profissional',
  'cancelScheduleDialog.patient': 'Paciente',
  'cancelScheduleDialog.confirm': 'Confirmar',
  'cancelScheduleDialog.reason': 'Motivo do Cancelamento',
  'cancelScheduleDialog.reasonDetails':
    'Descreva detalhadamente o motivo desse cancelamento estar sendo cancelado. Essa informação será anexada ao atendimento para fins de auditoria',
  'cancelScheduleDialog.cancelNextSchedules':
    'Cancelar todos os atendimentos associados ao plano de atendimento',

  'scheduleDetails.button.cancel': 'Cancelar Atendimento',
  'scheduleDetails.button.finish': 'Finalizar Atendimento',
  'scheduleDetails.cancellingReason.description': 'Motivo: ',
  'scheduleDetails.cancellingReason.title': 'Esse atendimento foi cancelado',
  'scheduleDetails.cancellingReason.date': 'Data do cancelamento: ',
  'scheduleDetails.cancellingReason.cancelledBy': 'Cancelado por: ',
  'scheduleDetails.professional': 'Profissional',
  'scheduleDetails.patient': 'Paciente',
  'scheduleDetails.onlineFulfillment': 'Atendimento Online',
  'scheduleDetails.joinMeet': 'Ir para a chamada',
  'scheduleDetails.viewProfile': 'Ver Perfil',
  'scheduleDetails.paymentStatus': 'Situação do Pagamento',
  'scheduleDetails.checkout': 'Realizar Pagamento',

  'finishScheduleDialog.title': 'Deseja finalizar o atendimento?',
  'finishScheduleDialog.description': 'Essa ação não poderá ser desfeita',
  'finishScheduleDialog.button.goBack': 'Voltar',
  'finishScheduleDialog.button.confirm': 'Confirmar',

  'paymentStatus.waiting': 'Aguardando Pagamento',
  'paymentStatus.paid': 'Pagamento Confirmado',
  'paymentStatus.refused': 'Pagamento Recusado',
  'paymentStatus.refunded': 'Pagamento Estornado',
  'paymentStatus.cancelled': 'Pagamento Cancelado',
  'paymentStatus.skipped': 'Pagamento Presencial',
  'paymentStatus.processing': 'Processando Pagamento',
  'paymentStatus.unknown': 'Status Desconhecido',
  'listProfessionalpatients.title': 'Pacientes',
  'listProfessionalpatients.subtitle': 'Lista de Pacientes',

  'listProfessionalpatients.table.column.patient': 'Paciente',
  'listProfessionalpatients.table.column.state': 'Status',
  'listProfessionalpatients.table.column.nextMeet': 'Próximo atendimento',

  'listProfessionalpatients.status.recurrent': 'Recorrente',
  'listProfessionalpatients.status.firstMeet': 'Primeiro Atendimento',
  'listProfessionalpatients.status.inactive': 'Desativado',
  'listProfessionalpatients.status.active': 'Ativo',

  'api.invitePatient.success': 'Convite enviado com sucesso',
  'api.invitePatient.error': 'Não foi possível enviar o convite',
  'invitePatient.title': 'Convidar Paciente',

  'inviteProfessional.title': 'Convidar Profissional',

  'api.financilaReceipts.send.success': 'Nota enviada com sucesso',
  'api.financilaReceipts.send.error':
    'Não foi possível enviar a nota, tente novamente',

  'professionals.smart.search.title': 'O que você esta sentindo?',
  'professionals.smart.search.subtitle':
    'Nos conte um pouco sobre o seu estado mental, vamos indicar os melhores profissionais para você',

  'professionals.smart.search.form.title':
    'Selecione as alternativas que indentificam com o que você está sentindo.',
  'professionals.smart.search.form.subtitle':
    'Não há obrigatoriedade em assinalar alguma alterinativa. Só assinale se realmente se identificar',

  'professionals.smart.search.success.title':
    'Questionário finalizado com sucesso',
  'professionals.smart.search.success.subtitle':
    'Realizamos uma filtragem baseada em suas respostas nesse questionário, clique no botão abaixo para visualizar o resultado da filtragem.',

  'professionals.smart.search.form.quote1':
    'sinto tristeza a maior parte dos meus dias',
  'professionals.smart.search.form.quote2':
    'deixei de sentir prazer em coisas que eu geralmente gosto',
  'professionals.smart.search.form.quote3':
    'tenho ficado várias noites acordado e/ou me sentindo muito produtivo, com ideias e projetos novos que não condizem com o meu habitual',
  'professionals.smart.search.form.quote4':
    'sinto que existem pessoas me perseguindo e preciso me defender',
  'professionals.smart.search.form.quote5':
    'as pessoas tem me achado mais falante e acelerado do que o habitual e/ou me sinto sem “filtro”, com falas inadequadas autopercebidas ou relatadas por terceiros',
  'professionals.smart.search.form.quote6':
    'tenho me ferido fisicamente como forma de tentar enfrentar minha angústia',
  'professionals.smart.search.form.quote7':
    'iniciei ou aumentei o uso de álcool/drogas mesmo que isso esteja causando prejuízos em minha vida',
  'professionals.smart.search.form.quote8':
    'frequentemente sinto dificuldade para pegar no sono e/ou acordo antes do horário previsto e não consigo mais dormir',
  'professionals.smart.search.form.quote9':
    'tenho constante sentimento de culpa e inadequação, me gerando tristeza e/ou prejuízo no meu dia a dia',
  'professionals.smart.search.form.quote10':
    'tenho episodios de falta de ar e angustia, já procurei médicos para descartar alguma doença física e nada foi encontrado',
  'professionals.smart.search.form.quote11':
    'tenho a constante sensação de estar sendo observado e penso que as pessoas podem estar me perseguindo',
  'professionals.smart.search.form.quote12':
    'tenho muita dificuldade em dizer “não” para as pessoas, mesmo que isso me prejudique',
  'professionals.smart.search.form.quote13':
    'vivo uma relação ruim com meu/minha companheiro(a) mas não consigo me separar',
  'professionals.smart.search.form.quote14':
    'as vezes questiono meus próprios valores e tenho a sensação de que nem sempre faço escolhas certas',
  'professionals.smart.search.form.quote15':
    'não consigo entender meus próprios sentimentos',
  'professionals.smart.search.form.quote16':
    'não consigo fazer amigos e sinto sempre sozinho (a).',
  'professionals.smart.search.form.quote17':
    'meus amigos/familiares dizem que sou organizado (a) demais, pois quero tudo sempre no lugar “certo',
  'professionals.smart.search.form.quote18':
    'tenho curiosidade em saber mais sobre eu mesmo (a)',
  'deleteProfessionalDialog.title': 'Deseja desativar esse profissional?',
  'deleteProfessionalDialog.description': 'Essa ação não poderá ser desfeita',
  'deleteProfessionalDialog.button.goBack': 'Voltar',
  'deleteProfessionalDialog.button.confirm': 'Desativar',

  'deletePatientDialog.title': 'Deseja deletar esse paciente?',
  'deletePatientDialog.description': 'Essa ação não poderá ser desfeita',
  'deletePatientDialog.button.goBack': 'Voltar',
  'deletePatientDialog.button.confirm': 'Deletar',

  'professionals.warning.danger.title': 'Sinais de alerta',
  'professionals.warning.danger.subtitle':
    'Aviso para procurar atendimento psiquiátrico com urgência:',
  'jitsiMeet.title': 'Atendimento Online',
  'jitsiMeet.button.leave': 'Sair da Chamada',
  'jitsiMeet.button.start': 'Iniciar Atendimento',
  'jitsiMeet.button.fab': 'Prontuário',
  'jitsiMeet.list.anamnese': 'Ficha de Anamnese',
  'jitsiMeet.list.clinicalFollowUp': 'Folha de Evolução',
  'jitsiMeet.list.prescription': 'Prescrições',
  'jitsiMeet.scheduleNotConfirmed':
    'O pagamento desse agendamento não foi confirmado',
  'jitsiMeet.notMemberOfSchedule': 'Você não faz parte desse atendimento',

  'listClinicalFollowUp.header.date': 'Data de Registro',
  'listClinicalFollowUp.button.edit': 'Editar',
  'listClinicalFollowUp.button.view': 'Visualizar',

  'createClinicalFollowUpDialog.title': 'Folha de Evolução',
  'createClinicalFollowUpDialog.button.cancel': 'Cancelar',
  'createClinicalFollowUpDialog.button.confirm': 'Confirmar',
  'createClinicalFollowUpDialog.input.notes.label': 'Anotações',
  'createClinicalFollowUpDialog.input.notes.placeholder':
    'Adicione informações relevantes em relação a esse paciente',
  'clinicalFollowUpDialog.title': 'Folha de Evolução',
};

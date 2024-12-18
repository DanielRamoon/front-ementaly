import { IProfessional } from '../libs';

export function getProfessionalCertification(professional: IProfessional) {
  let crm = 'Não se aplica';

  if (professional.crm) {
    crm = `${professional.crm}/${professional.crmState}`;
  }

  let crp = 'Não se aplica';

  if (professional.crp) {
    crp = `${professional.crp}/${professional.crpState}`;
  }

  return `CRM: ${crm} / CRP: ${crp}`;
}

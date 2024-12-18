export interface IAnamneseSaveDTOAnswer {
  question: string;
  value: string;
}

export interface IAnamneseSaveDTO {
  patient: string;
  answers: Array<IAnamneseSaveDTOAnswer>;
}

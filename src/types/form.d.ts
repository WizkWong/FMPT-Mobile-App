export interface UserErrorField {
  username?: string;
  department?: string;
}

export interface PartErrorField {
  name?: string;
  grade?: string;
  nettSize?: string;
  moulderSize?: string;
}

export interface ProductErrorField {
  name?: string;
  productPartList?: string;
}

export interface PartProcedureErrorField {
  description?: string;
  department?: string;
}
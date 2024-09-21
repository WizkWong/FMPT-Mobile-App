export interface Part {
  id?: number;
  name?: string;
  description?: string;
  grade?: string;
  nettWidth?: number;
  nettHeight?: number;
  nettLength?: number;
  moulderWidth?: number;
  moulderHeight?: number;
  moulderLength?: number;
  image?: string;
}

export interface PartPage {
  partList: Part[];
  hasNext: boolean;
}

export interface Product {
  id?: number;
  name?: string;
  description?: string;
  image?: string;
}

export interface ProductPage {
  productList: Product[];
  hasNext: boolean;
}

export interface ProductPart {
  part?: Part;
  piece?: number;
}

export interface ProductDetails {
  product?: Product;
  productPartList: ProductPart[];
}

export interface PartProcedure {
  id?: number;
  description?: string;
  stepNo?: number;
  attachment?: string;
  department?: string;
}

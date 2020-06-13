// Product Colors
export type ProductColor = 'white' | 'black' | 'red' | 'green' | 'purple' | 'yellow' | 'blue' | 'gray' | 'orange' | 'pink';

// Product Size
export type ProductSize = [];

// Product Tag
export type ProductTags = [];

// Product
export class Product {
  id: number;
  barcode: string;
  name: string;
  id_category: number;
  id_brand: number;
  summary: string;
  description: string;
  stock: number;
  price: number;
  color: string;
  status: number;
  kondisi: number;
  image: File;
  width: number;
  height: number;
  depth: number;
  weight: number;
  // discount: number;
  Mimage: string;
  create_at: Date;
  new: boolean;
  sale: boolean;
  id_parent: number;
  harga: number;
  video: string;
  imageCat: File;
  desCat: string;
  nameCat: string;
  discount: string;
  harga_disc: number;
  discountvalue: number;
  discounttab: string;
  // category: string;
  // size: ProductTags[];
  brand: ProductSize[];
  nic: string;
  setup: number;
  descr: string;
  slug: string;
  // variants: any[];
}

// Color Filter
export interface ColorFilter {
  color?: ProductColor;
}

// Tag Filter
export interface TagFilter {
  tag?: ProductTags;
}


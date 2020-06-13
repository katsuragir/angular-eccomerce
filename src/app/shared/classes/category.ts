// Category
export interface Category {
  id?: number;
  name?: string;
  type?: string;
  megaMenu?: boolean;
  slug_url?: string;
  id_parent: number;
  image?: File;
  children?: Category[];
  discount: string;
}

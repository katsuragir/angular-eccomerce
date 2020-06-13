
// City
export interface City {
  id?: number;
  result?: Hasil;
}

export interface Hasil {
  city_id?: number;
  city_name?: string;
  postal_code?: string;
  province?: string;
  province_id?: number;
  type?: string;
}

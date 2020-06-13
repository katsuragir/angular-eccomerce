
// District
export interface District {
  id?: number;
  result?: Res;
}

export interface Res {
  city?: string;
  city_id?: number;
  province?: string;
  province_id?: number;
  subdistrict_id?: number;
  subdistrict_name?: string;
  type?: string;
}

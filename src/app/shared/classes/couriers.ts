// couriers
export interface Courier {
  success?: number;
  result?: Result;
}

export interface Result {
  total?: number;
  couriers?: Couriers[];
}

export interface Couriers {
  slug?: string;
  name?: string;
  phone?: string;
  other_name?: string;
  web_url?: string;
  required_fields?: [];
  optional_fields?: [];
  default_language?: string;
  support_languages?: string[];
  service_from_country_iso3?: string[];
}

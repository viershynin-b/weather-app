export interface ILocalWeatherData {
  cityName: string;
  countryName: string;
  actualTemp: string;
  feelTemp: string;
  weatherDesc: string;
  humidity: string;
  pressure: string;
  temp_max: string;
  temp_min: string;
  icon: string;
  latitude: number,
  longtitude: number,
  timeZone: string;
  clouds: number;
  wind: number;
}

export interface ICityList {
  country: string;
  name: string;
  lat: number;
  lon: number;
  state?: string;
}

// useCountries.ts
import countries from "world-countries";

type Country = {
  cca2: string;
  name: {
    common: string;
  };
  flag: string;
  latlng: [number, number];
  region: string;
};

type FormattedCountry = {
  value: string;
  label: string;
  flag: string;
  latlng: [number, number];
  region: string;
};

const formattedCountries: FormattedCountry[] = countries.map((country: Country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

const useCountries = () => {
  const getAll = () => formattedCountries;

  const getByValue = (value: string) => {
    return formattedCountries.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useCountries;

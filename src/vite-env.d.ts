/// <reference types="vite/client" />

// Déclaration pour react-select-country-list
declare module 'react-select-country-list' {
  export default function countryList(): {
    getData: () => Array<{
      value: string;
      label: string;
    }>;
  };
}
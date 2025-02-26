import { useState } from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import countryList from "react-select-country-list";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { FormData } from "./types";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export default function KYBAddress({ register, errors }: Props) {
  const countries = countryList().getData();
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');

  const searchOptions = {
    types: ['address'],
    componentRestrictions: { country: 'fr' },
  };

  const citySearchOptions = {
    types: ['(cities)'],
    componentRestrictions: { country: 'fr' },
  };

  const handleAddressSelect = async (selected: string) => {
    try {
      const results = await geocodeByAddress(selected);
      
      setAddressLine(selected);
      register('addressLine').onChange({ target: { value: selected } });

      const addressComponents = results[0].address_components;
      const cityComponent = addressComponents.find(component => 
        component.types.includes('locality')
      );
      if (cityComponent) {
        setCity(cityComponent.long_name);
        register('city').onChange({ target: { value: cityComponent.long_name } });
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleCitySelect = async (selected: string) => {
    try {
      const results = await geocodeByAddress(selected);
      setCity(selected);
      register('city').onChange({ target: { value: selected } });
    } catch (error) {
      console.error('Error selecting city:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Adresse de l'entreprise</h2>
      <div className="space-y-4">
        <PlacesAutocomplete
          value={addressLine}
          onChange={setAddressLine}
          onSelect={handleAddressSelect}
          searchOptions={searchOptions}
          shouldFetchSuggestions={addressLine.length > 3}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="relative">
              <Input
                {...getInputProps({
                  placeholder: "Entrez l'adresse de l'entreprise",
                })}
                placeholder="Entrez l'adresse de l'entreprise"
                label="Ligne d'adresse"
                variant="bordered"
                color="primary"
                isInvalid={!!errors.addressLine}
                errorMessage={errors.addressLine?.message}
                onChange={(e) => setAddressLine(e.target.value)}
                classNames={{
                  label: "text-white/90",
                  input: "text-white",
                }}
              />
              {(loading || suggestions.length > 0) && (
                <div className="absolute z-10 w-full bg-background border border-white/10 rounded-md mt-1">
                  {loading && (
                    <div className="p-2 text-sm text-white/70">Chargement...</div>
                  )}
                  {suggestions.map(suggestion => (
                    <div
                      {...getSuggestionItemProps(suggestion)}
                      key={suggestion.placeId}
                      className="p-2 text-sm text-white hover:bg-white/10 cursor-pointer"
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </PlacesAutocomplete>

        <PlacesAutocomplete
          value={city}
          onChange={setCity}
          onSelect={handleCitySelect}
          searchOptions={citySearchOptions}
          shouldFetchSuggestions={city.length > 2}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="relative">
              <Input
                {...getInputProps({
                  placeholder: "Ville de l'entreprise",
                  className: "max-w-full",
                })}
                placeholder="Ville de l'entreprise"
                label="Ville"
                variant="bordered"
                color="primary"
                isInvalid={!!errors.city}
                errorMessage={errors.city?.message}
                onChange={(e) => setCity(e.target.value)}
                classNames={{
                  label: "text-white/90",
                  input: "text-white",
                }}
              />
              {(loading || suggestions.length > 0) && (
                <div className="absolute z-10 w-full bg-background border border-white/10 rounded-md mt-1">
                  {loading && (
                    <div className="p-2 text-sm text-white/70">Chargement...</div>
                  )}
                  {suggestions.map(suggestion => (
                    <div
                      {...getSuggestionItemProps(suggestion)}
                      key={suggestion.placeId}
                      className="p-2 text-sm text-white hover:bg-white/10 cursor-pointer"
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </PlacesAutocomplete>

        <Select
          {...register('country')}
          label="Pays"
          variant="bordered"
          color="primary"
          className="max-w-full"
          isInvalid={!!errors.country}
          errorMessage={errors.country?.message}
          classNames={{
            base: "max-w-full",
            label: "text-white/90 text-sm",
            value: "text-white text-sm",
            trigger: "h-[56px] bg-transparent border-2 border-white/20 data-[hover=true]:border-white/40 rounded-lg",
            listbox: "bg-background border-small border-white/10 rounded-lg",
            popover: "bg-background border-small border-white/10 rounded-lg",
          }}
        >
          {countries.map((country) => (
            <SelectItem 
              key={country.value} 
              value={country.value}
              className="text-white data-[hover=true]:bg-white/10"
            >
              {country.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { Autocomplete } from "./components/Autocomplete/Autocomplete";
import useDebounce from "./hooks/useDebounce";

interface CountryName {
  common: string;
  official: string;
}

interface CountryFlags {
  png: string;
  svg: string;
}

interface Country {
  name: CountryName;
  flags: CountryFlags;
}

function App() {
  const [value, setValue] = useState<string>("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const debounce = useDebounce();

  useEffect(() => {
    if (value.length === 0) {
      setSuggestions([]);
      return;
    }

    if (!!selectedSuggestion) return;

    const fetchCountries = () => {
      // TODO: Remove the hardcoded url below
      fetch(`https://restcountries.com/v3.1/name/${value}`)
        .then(async (response) => {
          const isJson = response.headers
            .get("Content-Type")
            ?.includes("application/json");
          const data = isJson ? await response.json() : null;

          if (!response.ok) {
            // TODO: Improve error handling to deal with specific statuses, e.g.: (401, 405, 500)
            if (response.status !== 404) {
              throw new Error(`${response.status} - ${response.statusText}`);
            }
          }

          if (data.length) {
            setSuggestions(() => [
              ...(data as Country[]).map((c) => c.name.common),
            ]);
            setErrorMessage("");
          }
        })
        .catch((e: Error) => {
          setErrorMessage(e.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    setIsLoading(true);
    debounce(() => {
      fetchCountries();
    }, 500);
  }, [value, selectedSuggestion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSuggestion("");
    setValue(e.target.value);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setValue(suggestion);
  };

  return (
    <div>
      <Autocomplete
        id="search-country"
        label="Country"
        name="country"
        placeholder="Type in to look up for a country"
        isLoading={isLoading}
        suggestions={suggestions}
        value={value}
        onChange={handleChange}
        onSelectSuggestion={handleSelectSuggestion}
      />
      {(!!errorMessage && (
        <span style={{ color: "darkred" }}>{errorMessage}</span>
      )) ||
        null}
    </div>
  );
}

export default App;

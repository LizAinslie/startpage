import { useEffect, useRef, useState } from "react";

const SearchBar = () => {
  const [searchBaseUrl, setSearchBaseUrl] = useState(
    "https://google.com/search",
  );
  const [searchMethod, setSearchMethod] = useState("GET");
  const [queryParamName, setQueryParamName] = useState("q");

  const searchInput = useRef<HTMLInputElement>(null);

  // focus when "/" is pressed
  const handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key == "/") {
      event.preventDefault();
      searchInput.current?.focus();
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", handleDocumentKeyDown);
    return () =>
      document.removeEventListener("keypress", handleDocumentKeyDown);
  }, []);

  // focus when first rendered
  useEffect(() => {
    searchInput.current?.focus();
  }, []);

  return (
    <form id="search" action={searchBaseUrl} method={searchMethod}>
      <input
        type="search"
        name={queryParamName}
        placeholder="Search..."
        ref={searchInput}
      />
    </form>
  );
};

export default SearchBar;

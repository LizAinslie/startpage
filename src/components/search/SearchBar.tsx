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
    if ((event.ctrlKey || event.metaKey) && event.code === "KeyK") {
      event.preventDefault();
      searchInput.current?.focus();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleDocumentKeyDown);
    return () => window.removeEventListener("keydown", handleDocumentKeyDown);
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

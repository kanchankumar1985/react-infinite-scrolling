import "./App.css";
import { useState, useCallback, useRef } from "react";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  function handleQueryChange(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  const { books, isLoading, hasMore, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const bookCallBackRef = useCallback(
    (node) => {
      console.log(`node printed ===> `, node);
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
          console.log("Visible ", entries[0].target);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <div className="App">
      <header className="App-header">
        <input type="text" value={query} onChange={handleQueryChange} />
        <div className="book-container">
            {books.map((book, index) => {
              if (books.length === index + 1) {
                return (
                  <p ref={bookCallBackRef} key={book}>
                    {book}
                  </p>
                );
              } else {
                return <p key={book}>{book}</p>;
              }
            })}
        </div>
        <div> {isLoading && "Loading ...."}</div>
        <div> {error && "Error"}</div>
      </header>
    </div>
  );
}

export default App;

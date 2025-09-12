interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ query, onChange }: SearchBarProps) => {
  return (
    <div style={{ margin: "20px 0" }}>
      <input
        type="text"
        placeholder="Buscar películas..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default SearchBar;

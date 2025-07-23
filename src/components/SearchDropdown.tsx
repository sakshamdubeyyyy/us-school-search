import React, {
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle
} from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

interface SearchDropdownProps<T> {
  placeholder: string;                             
  searchFunction: (query: string) => Promise<T[]>; 
  renderItem: (item: T) => React.ReactNode;        
  getUniqueKey: (item: T) => string;               
  onSelect: (item: T) => void;                     
  deduplicate?: (items: T[]) => T[];               
}

export interface SearchDropdownRef {
  reset: () => void;
}

function SearchDropdownInner<T>(
  {
    placeholder,
    searchFunction,
    renderItem,
    getUniqueKey,
    onSelect,
    deduplicate,
  }: SearchDropdownProps<T>,
  ref: React.Ref<SearchDropdownRef>
) {
  // Component state
  const [query, setQuery] = useState("");        
  const [results, setResults] = useState<T[]>([]); 
  const [loading, setLoading] = useState(false);   
  const [showDropdown, setShowDropdown] = useState(false); 
  const [hasSelected, setHasSelected] = useState(false);   

  // Expose reset method to parent via ref
  useImperativeHandle(ref, () => ({
    reset: () => {
      setQuery("");
      setResults([]);
      setShowDropdown(false);
      setHasSelected(false);
    },
  }));

  // Debounced search effect triggered when query changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      // Trigger search only if query length is sufficient and user hasn't selected an item
      if (query.trim().length >= 3 && !hasSelected) {
        setLoading(true);
        try {
          let data = await searchFunction(query);
          if (deduplicate) {
            data = deduplicate(data); 
          }
          setResults(data);
          setShowDropdown(true); 
        } catch (error) {
          console.error("Error in dropdown search:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Reset results and hide dropdown if input is invalid or cleared
        setResults([]);
        setShowDropdown(false);
      }
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [query, hasSelected, searchFunction]);

  return (
    <VStack align="stretch" position="relative" width="100%">
      {/* Input field for search */}
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setHasSelected(false); 
        }}
        onFocus={() => {
          // Show dropdown if valid input exists
          if (query.length >= 3 && !hasSelected) {
            setShowDropdown(true);
          }
        }}
      />

      {/* Loading indicator */}
      {loading && <Spinner size="sm" mt={2} />}

      {/* Results dropdown */}
      {showDropdown && (
        <Box
          position="absolute"
          top="100%"
          bg="white"
          shadow="md"
          border="1px solid #ccc"
          borderRadius="md"
          width="100%"
          zIndex={10}
          maxHeight="200px"
          overflowY="auto"
        >
          <List spacing={0}>
            {/* Render search results */}
            {results.length > 0 ? (
              results.map((item) => (
                <ListItem
                  key={getUniqueKey(item)}
                  px={3}
                  py={2}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => {
                    onSelect(item);                    
                    setQuery(getUniqueKey(item));      
                    setHasSelected(true);              
                    setShowDropdown(false);            
                  }}
                >
                  {renderItem(item)} 
                </ListItem>
              ))
            ) : (
              <ListItem px={3} py={2}>
                <Text>No results found</Text> 
              </ListItem>
            )}
          </List>
        </Box>
      )}
    </VStack>
  );
}

// Exporting component using forwardRef with proper generic typing
const SearchDropdown = forwardRef(SearchDropdownInner) as <T>(
  props: SearchDropdownProps<T> & { ref?: React.Ref<SearchDropdownRef> }
) => ReturnType<typeof SearchDropdownInner>;

export default SearchDropdown;

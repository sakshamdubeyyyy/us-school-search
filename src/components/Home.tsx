import React from "react";
import {
  Center,
  ScaleFade,
  Spinner,
  VStack,
  Text,
  Box,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import SearchControls from "@components/SearchControls";
import SchoolTable from "@components/SchoolTable";
import PaginationControls from "@components/PaginationControls";

// Custom hook for managing school data and search state
import { useSchoolData } from "src/hooks/useSchoolData";

const Home: React.FC = () => {
  // Destructuring values and handlers from the custom hook
  const {
    loading,
    currentData,
    currentPage,
    totalPages,
    setCurrentPage,
    citySearchRef,
    schoolSearchRef,
    selectedCity,
    handleCitySelect,
    handleSchoolSelect,
    resetFilters,
  } = useSchoolData();

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-tr, teal.400, cyan.500)"
      py={{ base: 8, md: 10 }}
      px={{ base: 4, md: 10 }}
    >
      <Center flexDirection="column" w="100%">
        <VStack spacing={10} w="100%" maxW="1200px" align="start">
          {/* Main Heading */}
          <Heading
            color="white"
            size={useBreakpointValue({ base: "lg", md: "2xl" })}
            textAlign="left"
            w="full"
          >
            🌎 U.S. Schools Directory
          </Heading>

          {/* Search filters: city and school input fields */}
          <SearchControls
            selectedCity={selectedCity}
            onReset={resetFilters}
            onCitySelect={handleCitySelect}
            onSchoolSelect={handleSchoolSelect}
            citySearchRef={citySearchRef}
            schoolSearchRef={schoolSearchRef}
          />

          {/* Conditional display of selected city info */}
          {selectedCity && (
            <Text fontSize="lg" color="white">
              Showing schools for: <b>{selectedCity}</b>
            </Text>
          )}

          {/* Fade-in animation for school results and loading state */}
          <ScaleFade initialScale={0.9} in={true} style={{ width: "100%" }}>
            {loading ? (
              // Display loading spinner when fetching data
              <Center py={20}>
                <Spinner size="xl" thickness="4px" color="white" />
              </Center>
            ) : (
              // School results container
              <VStack
                spacing={8}
                w="100%"
                bg="white"
                p={6}
                rounded="2xl"
                boxShadow="2xl"
              >
                {/* Table displaying current page school data */}
                <SchoolTable schools={currentData} />

                {/* Pagination controls to navigate through pages */}
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onNext={() => setCurrentPage((p) => p + 1)}
                  onPrev={() => setCurrentPage((p) => p - 1)}
                />
              </VStack>
            )}
          </ScaleFade>
        </VStack>
      </Center>
    </Box>
  );
};

export default Home;

import React from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import SearchDropdown, { SearchDropdownRef } from "./SearchDropdown";
import {
  searchSchoolDistricts,
  searchSchools,
  NCESSchoolFeatureAttributes,
} from "@utils/nces";

interface Props {
  selectedCity: string;
  onReset: () => void;
  onCitySelect: (city: string) => void;
  onSchoolSelect: (school: NCESSchoolFeatureAttributes) => void;
  citySearchRef: React.RefObject<SearchDropdownRef>;
  schoolSearchRef: React.RefObject<SearchDropdownRef>;
}

const SearchControls: React.FC<Props> = ({
  selectedCity,
  onReset,
  onCitySelect,
  onSchoolSelect,
  citySearchRef,
  schoolSearchRef,
}) => {
  const searchAllCities = async (
    query: string
  ): Promise<{ LCITY: string }[]> => {
    const [districts, schools] = await Promise.all([
      searchSchoolDistricts(query),
      searchSchools(query),
    ]);

    const districtCities = districts
      .map((d) => d.LCITY?.trim())
      .filter(Boolean);

    const schoolCities = schools
      .map((s: NCESSchoolFeatureAttributes) => s.CITY?.trim())
      .filter(Boolean);

    const allCities = [...districtCities, ...schoolCities];

    // Deduplicate city names
    const uniqueCities = [...new Set(allCities)];

    return uniqueCities.map((city) => ({ LCITY: city! }));
  };

  return (
    <>
      {/* Reset button shown only when a city is selected */}
      {selectedCity && (
        <Button
          onClick={onReset}
          variant="solid"
          size="sm"
          colorScheme="pink"
          leftIcon={<ArrowLeft size={18} />}
        >
          Back to All Schools
        </Button>
      )}

      {/* Flex layout to arrange both search boxes responsively */}
      <Flex
        w="100%"
        direction={{ base: "column", md: "row" }}
        gap={6}
        justify="space-between"
        align="center"
      >
        {/* City Search Box */}
        <Box
          flex="1"
          maxW={{ base: "100%", md: "48%" }}
          bg="white"
          p={4}
          rounded="xl"
          boxShadow="lg"
        >
          <SearchDropdown
            ref={citySearchRef}
            placeholder="Search by district..."
            searchFunction={searchAllCities}
            onSelect={(item) => onCitySelect(item.LCITY!)}
            getUniqueKey={(item) => item.LCITY!}
            renderItem={(item) => <Text>{item.LCITY}</Text>}
            deduplicate={(items) => [
              ...new Map(items.map((i) => [i.LCITY?.trim(), i])).values(),
            ]}
          />
        </Box>

        {/* School Search Box */}
        <Box
          flex="1"
          maxW={{ base: "100%", md: "48%" }}
          bg="white"
          p={4}
          rounded="xl"
          boxShadow="lg"
        >
          <SearchDropdown
            ref={schoolSearchRef}
            placeholder="Search by school name..."
            searchFunction={searchSchools}
            onSelect={onSchoolSelect}
            getUniqueKey={(school) => `${school.NAME}-${school.CITY}`}
            renderItem={(school) => (
              <Text>
                {school.NAME} — {school.CITY}, {school.STATE}
              </Text>
            )}
            deduplicate={(schools) => {
              // Deduplication logic using Set for school name + city
              const seen = new Set();
              return schools.filter((s) => {
                const key = `${s.NAME}-${s.CITY}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              });
            }}
          />
        </Box>
      </Flex>
    </>
  );
};

export default SearchControls;

import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronUp, ChevronDown } from "lucide-react"; 
import { NCESSchoolFeatureAttributes } from "@utils/nces";
import SchoolDetailsModal from "./SchoolDetailsModal";

interface Props {
  schools: NCESSchoolFeatureAttributes[];
}

// Define sortable keys from school data
type SortKey = "NAME" | "STREET" | "CITY" | "STATE" | "ZIP";

const SchoolTable: React.FC<Props> = ({ schools }) => {
  // Modal control for school details
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Track selected school for modal display
  const [selectedSchool, setSelectedSchool] =
    React.useState<NCESSchoolFeatureAttributes | null>(null);

  // Track sort key and sort order state
  const [sortKey, setSortKey] = React.useState<SortKey>("NAME");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  // Open modal and set selected school when a row is clicked
  const handleRowClick = (school: NCESSchoolFeatureAttributes) => {
    setSelectedSchool(school);
    onOpen();
  };

  // Handle column sort logic
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle sort order if same column clicked
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Sort by new key in ascending order
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Memoized sorted list of schools based on selected column and order
  const sortedSchools = React.useMemo(() => {
    return [...schools].sort((a, b) => {
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      return sortOrder === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [schools, sortKey, sortOrder]);

  // Define table headers with display labels and sort keys
  const headers: { label: string; key: SortKey }[] = [
    { label: "Name", key: "NAME" },
    { label: "Street", key: "STREET" },
    { label: "District", key: "CITY" },
    { label: "State", key: "STATE" },
    { label: "ZIP", key: "ZIP" },
  ];

  return (
    <>
      {/* School Data Table */}
      <Table variant="simple" size="md" width="100%">
        {/* Table Header */}
        <Thead bg="blue.500">
          <Tr>
            {headers.map(({ label, key }) => (
              <Th
                key={key}
                color="white"
                fontSize="md"
                fontWeight="medium"
                letterSpacing="wide"
                textTransform="uppercase"
                py={3}
                cursor="pointer"
                onClick={() => handleSort(key)} // Sort on header click
              >
                <Box display="flex" alignItems="center" gap="1">
                  {label}
                  {/* Show sort icon if current column is sorted */}
                  {sortKey === key &&
                    (sortOrder === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </Box>
              </Th>
            ))}
          </Tr>
        </Thead>

        {/* Table Body */}
        <Tbody>
          {sortedSchools.map((school, index) => (
            <Tr
              key={index}
              onClick={() => handleRowClick(school)} // Open details modal
              _hover={{ bg: "blue.50", transform: "scale(1.01)" }}
              cursor="pointer"
              transition="all 0.2s ease-in-out"
            >
              <Td fontWeight="bold" color="gray.700">
                {school.NAME}
              </Td>
              <Td>{school.STREET}</Td>
              <Td>{school.CITY}</Td>
              <Td>{school.STATE}</Td>
              <Td>{school.ZIP}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal: Displays selected school details */}
      <SchoolDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        school={selectedSchool}
      />
    </>
  );
};

export default SchoolTable;

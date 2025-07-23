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
import { NCESSchoolFeatureAttributes } from "@utils/nces";
import SchoolDetailsModal from "./SchoolDetailsModal";

interface Props {
  schools: NCESSchoolFeatureAttributes[];
}

const SchoolTable: React.FC<Props> = ({ schools }) => {
  // Chakra UI hook to control the modal's open/close state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State to keep track of the currently selected school
  const [selectedSchool, setSelectedSchool] =
    React.useState<NCESSchoolFeatureAttributes | null>(null);

  // Handle row click: sets selected school and opens modal
  const handleRowClick = (school: NCESSchoolFeatureAttributes) => {
    setSelectedSchool(school);
    onOpen();
  };

  return (
    <>
      <Table variant="simple" size="md" width="100%">
        {/* Table header with column names */}
        <Thead bg="blue.500">
          <Tr>
            {["Name", "Street", "City", "State", "ZIP"].map((header) => (
              <Th
                key={header}
                color="white"
                fontSize="md"
                fontWeight="medium"
                letterSpacing="wide"
                textTransform="uppercase"
                py={3}
              >
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>

        {/* Table body rendering each school row */}
        <Tbody>
          {schools.map((school, index) => (
            <Tr
              key={index}
              onClick={() => handleRowClick(school)} 
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

      {/* Modal to show school details when a row is clicked */}
      <SchoolDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        school={selectedSchool}
      />
    </>
  );
};

export default SchoolTable;

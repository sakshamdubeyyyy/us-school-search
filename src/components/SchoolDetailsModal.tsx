import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Box,
  Flex,
  Stack,
  useBreakpointValue,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

interface Props {
  isOpen: boolean; 
  onClose: () => void; 
  school: NCESSchoolFeatureAttributes | null; 
}

const SchoolDetailsModal: React.FC<Props> = ({ isOpen, onClose, school }) => {
  // Detect if the screen is mobile-sized to adjust layout responsively
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="2xl"
        boxShadow="2xl"
        bg="white"
        p={4}
        border="2px solid"
        borderColor="teal.200"
      >
        {/* Modal Header with Title */}
        <ModalHeader pb={0}>
          <Heading size="lg" color="teal.500">
            🏫 School Details
          </Heading>
        </ModalHeader>

        {/* Close Button (top-right corner) */}
        <ModalCloseButton />

        {/* Modal Body */}
        <ModalBody pt={4} pb={6}>
          {/* If a school is selected, display its details */}
          {school ? (
            <Flex
              direction={isMobile ? "column" : "row"} 
              gap={8}
              align="flex-start"
              wrap="wrap"
            >
              {/* Left Side: Basic School Information */}
              <Stack spacing={2} flex="1" minW="260px">
                <Text fontSize="lg" fontWeight="semibold">
                  {school.NAME}
                </Text>
                <Text>
                  <b>Street:</b> {school.STREET}
                </Text>
                <Text>
                  <b>City:</b> {school.CITY}
                </Text>
                <Text>
                  <b>State:</b> {school.STATE}
                </Text>
                <Text>
                  <b>ZIP:</b> {school.ZIP}
                </Text>
              </Stack>

              {/* Right Side: Google Maps Embed (if location available) */}
              {school.LAT && school.LON && (
                <Box
                  flex="1"
                  minW="300px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="lg"
                  border="1px solid"
                  borderColor="cyan.200"
                >
                  <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    // Embeds a Google Map using the school's full address
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      `${school.NAME}, ${school.STREET}, ${school.CITY}, ${school.STATE}`
                    )}&z=15&output=embed`}
                  />
                </Box>
              )}
            </Flex>
          ) : (
            // Fallback if no school data is provided
            <Text color="red.500" fontWeight="semibold">
              No data available.
            </Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SchoolDetailsModal;

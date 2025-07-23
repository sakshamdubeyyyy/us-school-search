import React from "react";
import { Button, HStack, Text } from "@chakra-ui/react";

// Props interface defines the expected properties for pagination
interface Props {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

const PaginationControls: React.FC<Props> = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
}) => {
  return (
    // Horizontal stack to align pagination buttons and text
    <HStack spacing={4}>
      {/* Previous button: disabled on the first page */}
      <Button
        onClick={onPrev}
        isDisabled={currentPage === 1}
        colorScheme="blue"
      >
        Previous
      </Button>

      {/* Page info text */}
      <Text>
        Page {currentPage} of {totalPages}
      </Text>

      {/* Next button: disabled on the last page */}
      <Button
        onClick={onNext}
        isDisabled={currentPage === totalPages}
        colorScheme="blue"
      >
        Next
      </Button>
    </HStack>
  );
};

export default PaginationControls;

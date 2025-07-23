import { useEffect, useState, useRef } from "react";
import { searchSchools, searchSchoolDistricts, NCESSchoolFeatureAttributes } from "@utils/nces";
import { SearchDropdownRef } from "@components/SearchDropdown";

const ITEMS_PER_PAGE = 10;

export const useSchoolData = () => {
  const [loading, setLoading] = useState(false);
  const [allSchools, setAllSchools] = useState<NCESSchoolFeatureAttributes[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<NCESSchoolFeatureAttributes[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>("");

  const citySearchRef = useRef<SearchDropdownRef>(null);
  const schoolSearchRef = useRef<SearchDropdownRef>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const all = await searchSchools("");
        setAllSchools(all);
        setFilteredSchools(all);
      } catch (error) {
        console.error("Error fetching all schools:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCurrentPage(1);
    if (city === "") {
      setFilteredSchools(allSchools);
    } else {
      const filtered = allSchools.filter((s) => s.CITY?.toLowerCase() === city.toLowerCase());
      setFilteredSchools(filtered);
    }
  };

  const handleSchoolSelect = (school: NCESSchoolFeatureAttributes) => {
    setFilteredSchools([school]);
    setCurrentPage(1);
    setSelectedCity(school.CITY || "");
  };

  const resetFilters = () => {
    setFilteredSchools(allSchools);
    setSelectedCity("");
    setCurrentPage(1);
    citySearchRef.current?.reset();
    schoolSearchRef.current?.reset();
  };

  const totalPages = Math.ceil(filteredSchools.length / ITEMS_PER_PAGE);
  const currentData = filteredSchools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
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
  };
};

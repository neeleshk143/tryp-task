'use client';
import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Input, Button, Box, Select } from '@chakra-ui/react';

interface DataTableProps {
  headers: string[];
  rows: any[]; 
  caption?: string;
  sortable?: boolean;
  pagination?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  headers,
  rows,
  caption,
  sortable,
  pagination,
}) => {
  const [sortedColumn, setSortedColumn] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchText, setSearchText] = useState<string>('');
  const [filteredRows, setFilteredRows] = useState<any[]>(rows);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  useEffect(() => {
    // Apply sorting whenever sortedColumn or sortOrder changes
    if (sortable && sortedColumn) {
      setFilteredRows(sortRows(sortedColumn));
    } else {
      setFilteredRows(rows);
    }
  }, [sortedColumn, sortOrder, rows, sortable]);

  useEffect(() => {
    // Apply pagination whenever currentPage or rowsPerPage changes
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setFilteredRows(rows.slice(start, end));
  }, [currentPage, rows, rowsPerPage]);

  const handleHeaderClick = (column: string) => {
    if (sortable) {
      if (sortedColumn === column) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortedColumn(column);
        setSortOrder('asc');
      }
    }
  };

  const sortRows = (column: string) => {
    return filteredRows.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
  };

  const handleSearch = () => {
    const filtered = rows.filter((row) => {
      const values = Object.values(row);
      for (let value of values) {
        if (value && value.toString().toLowerCase().includes(searchText.toLowerCase())) {
          return true;
        }
      }
      return false;
    });
    setFilteredRows(filtered);
    setCurrentPage(1);
  };

  const handlePaginationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleRowSelection = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows((prevSelectedRows) => prevSelectedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, index]);
    }
  };

  const isRowSelected = (index: number) => selectedRows.includes(index);

  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const renderStatusCell = (status: string) => {
    let color = '';
    let bgColor = '';
  
    switch (status) {
      case 'Failed':
        color = 'white';
        bgColor = '#a34624';
        break;
      case 'Pending':
        color = 'white';
        bgColor = '#f5da42';
        break;
      case 'Completed':
        color = 'white';
        bgColor = 'green';
        break;
      default:
        break;
    }
  
    return (
      <Button
        variant="solid"
        size="sm"
        borderRadius="10px"
        fontWeight="bold"
        color={color}
        bgColor={bgColor}
        p={2}
        textTransform="capitalize"
      >
        {status}
      </Button>
    );
  };
  

  return (
    <Box>
      {caption && <caption>{caption}</caption>}
      <Box mb={4} display="flex" alignItems="center">
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          mr={4}
        />
        <Button colorScheme="teal" onClick={handleSearch} size="sm">
          Search
        </Button>
      </Box>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th
                key={header}
                onClick={() => handleHeaderClick(header)}
                cursor={sortable ? 'pointer' : 'default'}
                bg="gray.100"
                fontWeight="bold"
              >
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {filteredRows.map((row, index) => (
            <Tr
            key={index}
            bg={index % 2 === 0 ? '#f2ebe9' : '#968986'}
            _hover={{ bg: 'gray.200' }}
            onClick={() => toggleRowSelection(index)}
            cursor="pointer"
            >
              {headers.map((header) => (
                <Td key={header} py={10} px={55}>
                  {header === 'Select' ? (
            <input type="checkbox" checked={isRowSelected(index)} readOnly />
            ) : header === 'Status' ? (
              renderStatusCell(row[header])
               ) : (
          row[header]
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {pagination && (
        <Box mt={4} display="flex" alignItems="center">
          <Box mr={2}>
            Rows :
            <Select value={rowsPerPage} onChange={handlePaginationChange} ml={2} width="80px">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Select>
          </Box>
          <Box ml="auto">
           {currentPage} of {totalPages}
          </Box>
          <Button
            variant="solid"
            size="sm"
            borderRadius="10px"
            fontWeight="bold"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            colorScheme="teal"
            mr={2}
          >
            Previous
          </Button>
          <Button
             variant="solid"
             size="sm"
             borderRadius="10px"
             fontWeight="bold"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            colorScheme="teal"
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DataTable;

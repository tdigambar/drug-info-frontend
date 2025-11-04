import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography
} from '@mui/material';
import { Drug, TableColumn } from '../types';
import { formatLaunchDate } from '../utils/dateFormatter';

interface DrugTableProps {
  drugs: Drug[];
  columns: TableColumn[];
  onCompanyClick: (company: string) => void;
}

const DrugTable: React.FC<DrugTableProps> = ({ drugs, columns, onCompanyClick }) => {
  const getCellValue = (drug: Drug, columnId: string): string => {
    switch (columnId) {
      case 'id':
        return drug.id.toString();
      case 'code':
        return drug.code;
      case 'name':
        return `${drug.genericName} (${drug.brandName})`;
      case 'company':
        return drug.company;
      case 'launchDate':
        return formatLaunchDate(drug.launchDate);
      default:
        return '';
    }
  };

  if (drugs.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No drugs found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="drug information table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} sx={{ fontWeight: 'bold' }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {drugs.map((drug) => (
            <TableRow key={drug.id} hover>
              {columns.map((column) => {
                const isCompany = column.id === 'company';
                return (
                  <TableCell
                    key={column.id}
                    sx={{
                      cursor: isCompany ? 'pointer' : 'default',
                      color: isCompany ? 'primary.main' : 'inherit',
                      textDecoration: isCompany ? 'underline' : 'none',
                      '&:hover': isCompany
                        ? {
                            backgroundColor: 'action.hover',
                            textDecoration: 'underline'
                          }
                        : {}
                    }}
                    onClick={() => isCompany && onCompanyClick(drug.company)}
                  >
                    {getCellValue(drug, column.id)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DrugTable;


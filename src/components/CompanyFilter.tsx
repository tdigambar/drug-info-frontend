import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box
} from '@mui/material';

interface CompanyFilterProps {
  companies: string[];
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
}

const CompanyFilter: React.FC<CompanyFilterProps> = ({
  companies,
  selectedCompany,
  onCompanyChange
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onCompanyChange(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 300, mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="company-filter-label">Filter by Company</InputLabel>
        <Select
          labelId="company-filter-label"
          id="company-filter"
          value={selectedCompany}
          label="Filter by Company"
          onChange={handleChange}
        >
          <MenuItem value="all">All Companies</MenuItem>
          {companies.map((company) => (
            <MenuItem key={company} value={company}>
              {company}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CompanyFilter;


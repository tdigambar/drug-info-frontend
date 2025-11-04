import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import DrugTable from './components/DrugTable';
import CompanyFilter from './components/CompanyFilter';
import { Drug, TableConfig } from './types';
import { fetchTableConfig, fetchDrugs, fetchCompanies } from './services/api';

function App() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [tableConfig, setTableConfig] = useState<TableConfig | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [config, drugsData, companiesData] = await Promise.all([
          fetchTableConfig(),
          fetchDrugs(),
          fetchCompanies()
        ]);
        
        setTableConfig(config);
        setDrugs(drugsData);
        setCompanies(companiesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadDrugs = async () => {
      try {
        setLoading(true);
        const drugsData = await fetchDrugs(selectedCompany === 'all' ? undefined : selectedCompany);
        setDrugs(drugsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load drugs');
      } finally {
        setLoading(false);
      }
    };

    loadDrugs();
  }, [selectedCompany]);

  const handleCompanyClick = (company: string) => {
    setSelectedCompany(company);
  };

  if (loading && drugs.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && drugs.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Drug Information
      </Typography>
      
      <CompanyFilter
        companies={companies}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
      />
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {tableConfig && (
        <DrugTable
          drugs={drugs}
          columns={tableConfig.columns}
          onCompanyClick={handleCompanyClick}
        />
      )}
    </Container>
  );
}

export default App;

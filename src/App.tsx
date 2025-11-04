import React, { useState, useEffect } from 'react';
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
      <div className="container mx-auto mt-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && drugs.length === 0) {
    return (
      <div className="container mx-auto mt-16 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-16 mb-16 px-4 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8">Drug Information</h1>
      
      <CompanyFilter
        companies={companies}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
      />
      
      {loading && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {tableConfig && (
        <DrugTable
          drugs={drugs}
          columns={tableConfig.columns}
          onCompanyClick={handleCompanyClick}
        />
      )}
    </div>
  );
}

export default App;

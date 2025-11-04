import { Drug, TableConfig } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const fetchTableConfig = async (): Promise<TableConfig> => {
  const response = await fetch(`${API_BASE_URL}/table-config`);
  if (!response.ok) {
    throw new Error('Failed to fetch table configuration');
  }
  return response.json();
};

export const fetchDrugs = async (company?: string): Promise<Drug[]> => {
  const url = company && company !== 'all' 
    ? `${API_BASE_URL}/drugs?company=${encodeURIComponent(company)}`
    : `${API_BASE_URL}/drugs`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch drugs');
  }
  return response.json();
};

export const fetchCompanies = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/companies`);
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  return response.json();
};


import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { fetchTableConfig, fetchDrugs, fetchCompanies } from './services/api';

// Mock the API functions
jest.mock('./services/api');

const mockFetchTableConfig = fetchTableConfig as jest.MockedFunction<typeof fetchTableConfig>;
const mockFetchDrugs = fetchDrugs as jest.MockedFunction<typeof fetchDrugs>;
const mockFetchCompanies = fetchCompanies as jest.MockedFunction<typeof fetchCompanies>;

describe('App - Filtering Tests', () => {
  const mockDrugs = [
    {
      id: 1,
      code: '0006-0568',
      genericName: 'vorinostat',
      brandName: 'ZOLINZA',
      company: 'Merck Sharp & Dohme Corp.',
      launchDate: '2004-02-14T23:01:10Z'
    },
    {
      id: 2,
      code: '0006-0100',
      genericName: 'aspirin',
      brandName: 'BAYER',
      company: 'Bayer AG',
      launchDate: '1899-03-06T00:00:00Z'
    },
    {
      id: 3,
      code: '0006-0123',
      genericName: 'metformin',
      brandName: 'GLUCOPHAGE',
      company: 'Merck Sharp & Dohme Corp.',
      launchDate: '1995-12-29T00:00:00Z'
    }
  ];

  const mockCompanies = ['Bayer AG', 'Merck Sharp & Dohme Corp.'];

  const mockTableConfig = {
    columns: [
      { id: 'id', label: 'Id', sortable: false },
      { id: 'code', label: 'Code', sortable: true },
      { id: 'name', label: 'Name', sortable: true },
      { id: 'company', label: 'Company', sortable: true },
      { id: 'launchDate', label: 'Launch Date', sortable: true }
    ]
  };

  beforeEach(() => {
    mockFetchTableConfig.mockResolvedValue(mockTableConfig);
    mockFetchCompanies.mockResolvedValue(mockCompanies);
    mockFetchDrugs.mockResolvedValue(mockDrugs);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should filter drugs by company when selecting from dropdown', async () => {
    render(<App />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('vorinostat (ZOLINZA)')).toBeInTheDocument();
    });

    // Find and click the dropdown button
    const filterButton = screen.getByRole('button');
    await userEvent.click(filterButton);

    // Wait for dropdown to open and find the company option
    const companyOption = await screen.findByRole('option', { 
      name: 'Merck Sharp & Dohme Corp.' 
    });
    await userEvent.click(companyOption);

    // Verify that fetchDrugs was called with the selected company
    await waitFor(() => {
      expect(mockFetchDrugs).toHaveBeenCalledWith('Merck Sharp & Dohme Corp.');
    }, { timeout: 3000 });
  });

  it('should filter drugs by company when clicking on company cell in table', async () => {
    render(<App />);

    // Wait for initial data to load and all effects to complete
    await waitFor(() => {
      expect(screen.getByText('Merck Sharp & Dohme Corp.')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Wait for all initial API calls to complete
    await waitFor(() => {
      expect(mockFetchDrugs).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Give a small delay to ensure all effects have settled
    await new Promise(resolve => setTimeout(resolve, 100));

    // Clear previous calls after initial load
    mockFetchDrugs.mockClear();

    // Find the company text in the table (it's inside a clickable td)
    const companyTextElements = screen.getAllByText('Merck Sharp & Dohme Corp.');
    expect(companyTextElements.length).toBeGreaterThan(0);
    
    // Click on the first company text element
    // The click will bubble up to the parent <td> which has the onClick handler
    await userEvent.click(companyTextElements[0]);

    // Verify that fetchDrugs was called with the selected company
    await waitFor(() => {
      const calls = mockFetchDrugs.mock.calls;
      const hasCompanyCall = calls.some(call => call[0] === 'Merck Sharp & Dohme Corp.');
      if (!hasCompanyCall) {
        throw new Error('fetchDrugs was not called with the company name');
      }
    }, { timeout: 3000 });
    
    expect(mockFetchDrugs).toHaveBeenCalledWith('Merck Sharp & Dohme Corp.');
  });

  it('should show all drugs when "All Companies" is selected', async () => {
    render(<App />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('vorinostat (ZOLINZA)')).toBeInTheDocument();
    });

    // Click the dropdown button
    const filterButton = screen.getByRole('button');
    await userEvent.click(filterButton);

    // Wait for dropdown to open and click "All Companies" option
    const allCompaniesOption = await screen.findByRole('option', { 
      name: 'All Companies' 
    });
    await userEvent.click(allCompaniesOption);

    // Verify that fetchDrugs was called
    await waitFor(() => {
      expect(mockFetchDrugs).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should display all company names in the filter dropdown', async () => {
    render(<App />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Drug Information')).toBeInTheDocument();
    });

    // Click the dropdown button to open it
    const filterButton = screen.getByRole('button');
    await userEvent.click(filterButton);

    // Wait for dropdown to open and check that all companies are visible
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'All Companies' })).toBeInTheDocument();
    });
    
    expect(screen.getByRole('option', { name: 'Bayer AG' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Merck Sharp & Dohme Corp.' })).toBeInTheDocument();
  });
});

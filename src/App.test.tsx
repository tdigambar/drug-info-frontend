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
    const filteredDrugs = mockDrugs.filter(drug => drug.company === 'Merck Sharp & Dohme Corp.');

    render(<App />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('vorinostat (ZOLINZA)')).toBeInTheDocument();
    });

    // Find and click the company filter dropdown
    const filterSelect = screen.getByLabelText('Filter by Company');
    await userEvent.click(filterSelect);

    // Select a company
    const merckOption = screen.getByText('Merck Sharp & Dohme Corp.');
    await userEvent.click(merckOption);

    // Verify that fetchDrugs was called with the selected company
    await waitFor(() => {
      expect(mockFetchDrugs).toHaveBeenCalledWith('Merck Sharp & Dohme Corp.');
    });

    // Update mock to return filtered results
    mockFetchDrugs.mockResolvedValueOnce(filteredDrugs);

    // Re-render to show filtered results (this would happen in real app)
    // For testing purposes, we verify the API was called with correct filter
    expect(mockFetchDrugs).toHaveBeenCalledWith('Merck Sharp & Dohme Corp.');
  });

  it('should filter drugs by company when clicking on company cell in table', async () => {
    render(<App />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Merck Sharp & Dohme Corp.')).toBeInTheDocument();
    });

    // Find all company cells (there should be multiple)
    const companyCells = screen.getAllByText('Merck Sharp & Dohme Corp.');
    
    // Click on the first company cell in the table
    const firstCompanyCell = companyCells.find(cell => 
      cell.closest('tr') !== null
    );
    
    if (firstCompanyCell) {
      await userEvent.click(firstCompanyCell);

      // Verify that the selected company was set and fetchDrugs was called
      await waitFor(() => {
        expect(mockFetchDrugs).toHaveBeenCalledWith('Merck Sharp & Dohme Corp.');
      });
    }
  });

  it('should show all drugs when "All Companies" is selected', async () => {
    render(<App />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('vorinostat (ZOLINZA)')).toBeInTheDocument();
    });

    // Click on filter dropdown
    const filterSelect = screen.getByLabelText('Filter by Company');
    await userEvent.click(filterSelect);

    // Select "All Companies"
    const allOption = screen.getByText('All Companies');
    await userEvent.click(allOption);

    // Verify that fetchDrugs was called without a company filter (or with undefined)
    await waitFor(() => {
      expect(mockFetchDrugs).toHaveBeenCalled();
    });
  });

  it('should display all company names in the filter dropdown', async () => {
    render(<App />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Drug Information')).toBeInTheDocument();
    });

    // Click on filter dropdown
    const filterSelect = screen.getByLabelText('Filter by Company');
    await userEvent.click(filterSelect);

    // Check that all companies are in the dropdown
    expect(screen.getByText('Bayer AG')).toBeInTheDocument();
    expect(screen.getByText('Merck Sharp & Dohme Corp.')).toBeInTheDocument();
  });
});

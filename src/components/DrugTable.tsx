import React from 'react';
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
      <div className="p-6 text-center text-gray-600">
        No drugs found
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {drugs.map((drug) => (
            <tr
              key={drug.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {columns.map((column) => {
                const isCompany = column.id === 'company';
                return (
                  <td
                    key={column.id}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isCompany
                        ? 'text-blue-600 underline cursor-pointer hover:text-blue-800'
                        : 'text-gray-900'
                    }`}
                    onClick={() => isCompany && onCompanyClick(drug.company)}
                  >
                    {getCellValue(drug, column.id)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DrugTable;

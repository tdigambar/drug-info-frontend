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

  const getColumnClasses = (columnId: string) => {
    const baseClasses = "px-4 py-3 text-sm";
    switch (columnId) {
      case 'id':
        return `${baseClasses} w-16 text-center`;
      case 'code':
        return `${baseClasses} w-32`;
      case 'name':
        return `${baseClasses} min-w-[200px] max-w-[300px]`;
      case 'company':
        return `${baseClasses} min-w-[200px] max-w-[300px]`;
      case 'launchDate':
        return `${baseClasses} w-32`;
      default:
        return baseClasses;
    }
  };

  const getCellClasses = (columnId: string) => {
    const baseClasses = "px-4 py-4 text-sm";
    const isCompany = columnId === 'company';
    const clickableClasses = isCompany
      ? 'text-blue-600 underline cursor-pointer hover:text-blue-800'
      : 'text-gray-900';
    
    switch (columnId) {
      case 'id':
        return `${baseClasses} w-16 text-center ${clickableClasses}`;
      case 'code':
        return `${baseClasses} w-32 ${clickableClasses}`;
      case 'name':
        return `${baseClasses} min-w-[200px] max-w-[300px] break-words ${clickableClasses}`;
      case 'company':
        return `${baseClasses} min-w-[200px] max-w-[300px] break-words ${clickableClasses}`;
      case 'launchDate':
        return `${baseClasses} w-32 ${clickableClasses}`;
      default:
        return `${baseClasses} ${clickableClasses}`;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={getColumnClasses(column.id)}
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
                      className={getCellClasses(column.id)}
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
    </div>
  );
};

export default DrugTable;

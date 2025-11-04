import React from 'react';

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
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onCompanyChange(event.target.value);
  };

  return (
    <div className="mb-6 min-w-[300px] max-w-md">
      <label
        htmlFor="company-filter"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Filter by Company
      </label>
      <select
        id="company-filter"
        value={selectedCompany}
        onChange={handleChange}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All Companies</option>
        {companies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompanyFilter;

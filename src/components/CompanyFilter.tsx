import React, { useState, useRef, useEffect } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (company: string) => {
    onCompanyChange(company);
    setIsOpen(false);
  };

  const displayValue = selectedCompany === 'all' ? 'All Companies' : selectedCompany;

  return (
    <div className="mb-6 min-w-[300px] max-w-md">
      <label
        htmlFor="company-filter"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Filter by Company
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
        >
          <span className="truncate">{displayValue}</span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
            <div
              onClick={() => handleSelect('all')}
              className={`cursor-pointer select-none relative py-2 pl-4 pr-4 ${
                selectedCompany === 'all'
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="block truncate">All Companies</span>
            </div>
            {companies.map((company) => (
              <div
                key={company}
                onClick={() => handleSelect(company)}
                className={`cursor-pointer select-none relative py-2 pl-4 pr-4 ${
                  selectedCompany === company
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="block truncate">{company}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyFilter;

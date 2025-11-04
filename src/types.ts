export interface Drug {
  id: number;
  code: string;
  genericName: string;
  brandName: string;
  company: string;
  launchDate: string;
}

export interface TableColumn {
  id: string;
  label: string;
  sortable: boolean;
}

export interface TableConfig {
  columns: TableColumn[];
}


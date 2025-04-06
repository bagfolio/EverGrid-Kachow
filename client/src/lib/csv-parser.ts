import Papa from 'papaparse';
import { Facility } from '@/types/facility';

export interface ParseResult {
  data: Facility[];
  errors: Papa.ParseError[];
}

export const parseCSV = (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Facility>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results: Papa.ParseResult<any>) => {
        // Convert NaN values to null for consistent handling
        const parsedData = results.data.map((row: any) => {
          const cleanedRow: Record<string, any> = {};
          
          Object.entries(row).forEach(([key, value]) => {
            if (typeof value === 'number' && isNaN(value)) {
              cleanedRow[key] = null;
            } else {
              cleanedRow[key] = value;
            }
          });
          
          return cleanedRow as Facility;
        });
        
        resolve({
          data: parsedData,
          errors: results.errors
        });
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
};

export const processCSVFile = async (file: File): Promise<Facility[]> => {
  try {
    const result = await parseCSV(file);
    
    if (result.errors.length > 0) {
      console.error("CSV parsing errors:", result.errors);
    }
    
    return result.data;
  } catch (error) {
    console.error("Error processing CSV file:", error);
    throw error;
  }
};

export const parseCSVText = (csvText: string): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Facility>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results: Papa.ParseResult<any>) => {
        // Convert NaN values to null for consistent handling
        const parsedData = results.data.map((row: any) => {
          const cleanedRow: Record<string, any> = {};
          
          Object.entries(row).forEach(([key, value]) => {
            if (typeof value === 'number' && isNaN(value)) {
              cleanedRow[key] = null;
            } else {
              cleanedRow[key] = value;
            }
          });
          
          return cleanedRow as Facility;
        });
        
        resolve({
          data: parsedData,
          errors: results.errors
        });
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
};
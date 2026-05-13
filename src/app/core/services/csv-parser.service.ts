
import { Injectable } from '@angular/core';
import Papa from 'papaparse';
import { ChartData } from '../models/dashboard.models';

@Injectable({
    providedIn: 'root'
})
export class CsvParserService {

    constructor() { }

    parseCsv(file: File): Promise<ChartData> {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                complete: (result) => {
                    if (result.errors.length > 0) {
                        reject(result.errors);
                        return;
                    }
                    try {
                        const chartData = this.processData(result.data as any[][]);
                        resolve(chartData);
                    } catch (e) {
                        reject(e);
                    }
                },
                header: true, // Use first row as header
                skipEmptyLines: true,
                dynamicTyping: true // Auto convert numbers
            });
        });
    }

    private processData(data: any[]): ChartData {
        if (!data || data.length === 0) {
            throw new Error('No data found in CSV');
        }

        const headers = Object.keys(data[0]);

        // Find the first string/date column for labels
        // We look for a column where the value is NOT a number
        let labelField = headers.find(h => {
            const val = data[0][h];
            // If dynamicTyping is true, numbers are numbers. Strings are strings.
            return typeof val === 'string';
        });

        // If no string column, just use the first column
        if (!labelField) {
            labelField = headers[0];
        }

        // Find all numeric columns for datasets
        const valueFields = headers.filter(h => h !== labelField && typeof data[0][h] === 'number');

        // Prepare chart data
        const keyField = labelField as string;

        const labelsRaw = data.map(row => String(row[keyField]));

        // Check for duplicates to decide on aggregation
        const isDuplicateLabels = new Set(labelsRaw).size !== labelsRaw.length;

        let finalLabels: string[] = labelsRaw;
        let finalData: any[] = data;

        if (isDuplicateLabels) {
            // Aggregate by summing up numeric values for same label
            const aggregated = new Map<string, any>();

            data.forEach(row => {
                const label = String(row[keyField]);
                if (!aggregated.has(label)) {
                    // Start with copy of row
                    aggregated.set(label, { ...row });
                } else {
                    const existing = aggregated.get(label);
                    valueFields.forEach(field => {
                        const val = Number(row[field]) || 0;
                        existing[field] = (Number(existing[field]) || 0) + val;
                    });
                }
            });

            finalLabels = Array.from(aggregated.keys());
            finalData = Array.from(aggregated.values());
        }

        const datasets = valueFields.map((field, index) => {
            const color = this.getColor(index);
            return {
                label: field,
                data: finalData.map(row => Number(row[field]) || 0),
                borderColor: color,
                backgroundColor: color.replace('1)', '0.2)'),
                tension: 0.4,
                fill: true
            };
        });

        return {
            labels: finalLabels,
            datasets
        };
    }

    private getColor(index: number): string {
        const colors = [
            'rgba(59, 130, 246, 1)',   // Blue
            'rgba(16, 185, 129, 1)',   // Green
            'rgba(245, 158, 11, 1)',   // Yellow
            'rgba(239, 68, 68, 1)',    // Red
            'rgba(139, 92, 246, 1)',   // Purple
            'rgba(236, 72, 153, 1)',   // Pink
            'rgba(14, 165, 233, 1)',   // Light Blue
            'rgba(251, 146, 60, 1)',   // Orange
        ];
        return colors[index % colors.length];
    }

    parseRawCsv(file: File): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                reject(new Error('Invalid file type. Please upload a CSV file.'));
                return;
            }

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    resolve(result.data);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    }
}

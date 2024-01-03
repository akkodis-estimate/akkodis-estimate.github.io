import {Injectable} from '@angular/core';
import * as ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import {ExportData} from "../../../core/params/export-data";
import {AmountHelper} from "../../../helpers/amount.helper";
import {PeriodEnum} from "../../../core/enums/PeriodEnum";

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    workbook!: ExcelJS.Workbook;
    worksheet!: ExcelJS.Worksheet;

    constructor() {
    }

    generateExcel(exportData: ExportData, fileName: string): void {
        this.workbook = new ExcelJS.Workbook();
        this.worksheet = this.workbook.addWorksheet('A.D.');

        let row: any[] = [];
        this.worksheet.addRow(["Project title", exportData.project?.title]);
        this.worksheet.addRow(["Duration", exportData.project?.duration]);
        // this.worksheet.addRow(["Client", exportData.project?.client]);
        this.worksheet.addRow(["Description", exportData.project?.description]);
        this.worksheet.addRow([]);

        // Add resources headers
        const headers: string[] = Object.keys(this.resourceHeaders);
        this.worksheet.addRow(["Period", "Description", "Amount in AED"]);
        // Add resources
        exportData.resources?.forEach((item) => {
            let entries = Object.entries(item);
            entries.forEach((value: string[], index) => {
                if (headers.includes(value[0])) {
                    const row: any[] = [];
                    row.push(AmountHelper.getAmountPeriod(value[1]))
                    row.push(value[0]);
                    row.push(AmountHelper.getAmount(value[1]));
                    this.worksheet.addRow(row);
                }
            });
        });
        this.worksheet.addRow([]);
        row = [];
        row.push(PeriodEnum.Annually);
        row.push("Total cost");
        row.push(exportData.cost);
        this.worksheet.addRow(row);

        this.worksheet.addRow([]);
        row = [];
        row.push("");
        row.push("Margin %");
        row.push(exportData.project?.margin);
        this.worksheet.addRow(row);
        this.saveExcelFile(fileName);

        this.worksheet.addRow([]);
        row = [];
        row.push(PeriodEnum.Annually);
        row.push("Total price");
        row.push(exportData.price);
        this.worksheet.addRow(row);

        this.saveExcelFile(fileName);
    }

    saveExcelFile(fileName: string) {
        this.workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            saveAs(blob, `${fileName}.xlsx`);
        });
    }

    resourceHeaders: ResourceHeader = {
        basicSalary: "Basic salary",
        allowance: "Allowance",
        gratuity: "Gratuity",
        insurance: "Insurance",
        flightTicket: "Flight ticket",
        workPermit: "Work permit",
        office: "Office",
        generalSupportPackage: "IT - General support package",
        laptopWorkstation: "IT - Laptop + Workstation",
        licenses: "IT - Licences",
        mobilizationCost: "Mobilisation",
        parking: "Parking",
        transportation: "Transportation"
    };
}

export interface ResourceHeader {
    basicSalary?: string;
    allowance?: string;
    gratuity?: string;
    insurance?: string;
    flightTicket?: string;
    workPermit?: string;
    office?: string;
    generalSupportPackage?: string;
    laptopWorkstation?: string;
    licenses?: string;
    mobilizationCost?: string;
    parking?: string;
    transportation?: string;
}

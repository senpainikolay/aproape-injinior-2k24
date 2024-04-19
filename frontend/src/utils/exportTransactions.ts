import { Transaction } from "../models/Transaction";
import { saveAs } from "file-saver";

export enum FileFormat {
    CSV = 0,
    JSON = 1
};

interface ExportedTransaction {
    amount: number;
    date: string;
    description: string;
};

const toExportedTransaction = (transaction: Transaction) => {
    const exportedTransaction: ExportedTransaction = {
        amount: transaction.amount,
        date: transaction.datetime,
        description: transaction.description ?? "",
    };
    return exportedTransaction;
};

const toCSVString = (str: string) => {
    if (str === null) {
        return "";
    }
    return `"${str.replaceAll('"', '""')}"`
};

const toCSVBlob = (transactions: Array<ExportedTransaction>) => {
    if (transactions.length === 0) {
        return new Blob([], { type: 'text/csv' });
    }
    transactions.forEach(transaction => {
        transaction.description = toCSVString(transaction.description);
    });
    const csv = [
        Object.keys(transactions[0]).join(','),
        ...transactions.map(transaction => Object.values(transaction).join(','))
    ].join('\n');
    return new Blob([csv], { type: 'text/csv' });
};

const toJSONBlob = (transactions: Array<ExportedTransaction>) => {
    return new Blob([JSON.stringify(transactions)], { type: "application/json" });
};

export const exportTransactions = (transactions: Array<Transaction>, fileFormat: FileFormat, fileName: string) => {
    const exportedTransactions = transactions.map(toExportedTransaction);
    if (fileFormat === FileFormat.CSV) {
        saveAs(toCSVBlob(exportedTransactions), `${fileName}.csv`);
    }
    if (fileFormat === FileFormat.JSON) {
        saveAs(toJSONBlob(exportedTransactions), `${fileName}.json`);
    }
};

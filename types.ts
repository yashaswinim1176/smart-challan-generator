
export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  KANNADA = 'ka'
}

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal'
}

export enum PrinterType {
  BLUETOOTH = 'bluetooth',
  WIFI = 'wifi'
}

export interface ChallanData {
  fullName: string;
  accountNumber: string;
  branchName: string;
  amount: string;
  amountInWords: string;
  date: string;
  transactionType: TransactionType;
}

export interface OcrResult {
  fullName?: string;
  accountNumber?: string;
  branchName?: string;
}

export interface TranslationMap {
  [key: string]: {
    [Language.ENGLISH]: string;
    [Language.HINDI]: string;
    [Language.KANNADA]: string;
  }
}

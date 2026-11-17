
import { ChallanData, Language } from '../types';
import { LABELS } from '../constants';

export class WifiPrinterService {
  private ipAddress: string | null = null;

  setIpAddress(ip: string) {
    this.ipAddress = ip;
  }

  getIpAddress(): string | null {
    return this.ipAddress;
  }

  async printChallan(data: ChallanData, language: Language) {
    if (!this.ipAddress) throw new Error("Printer IP not set");

    // Construct raw ESC/POS payload
    const encoder = new TextEncoder();
    const ESC = 0x1B;
    const INIT = new Uint8Array([ESC, 0x40]);
    const CENTER = new Uint8Array([ESC, 0x61, 0x01]);
    const LEFT = new Uint8Array([ESC, 0x61, 0x00]);
    const BOLD_ON = new Uint8Array([ESC, 0x45, 0x01]);
    const BOLD_OFF = new Uint8Array([ESC, 0x45, 0x00]);
    const FEED = new Uint8Array([0x0A, 0x0A, 0x0A, 0x0A]);

    const parts: Uint8Array[] = [
      INIT,
      CENTER,
      BOLD_ON,
      encoder.encode("INDIA POST\n"),
      encoder.encode(`${LABELS.posb[language]}\n`),
      encoder.encode(`${LABELS.payInSlip[language]}\n`),
      BOLD_OFF,
      encoder.encode("--------------------------------\n"),
      LEFT,
      encoder.encode(`Date: ${data.date}\n`),
      encoder.encode(`Type: ${data.transactionType}\n`),
      encoder.encode(`PO: ${data.branchName}\n`),
      encoder.encode(`Acc No: ${data.accountNumber}\n`),
      encoder.encode(`Name: ${data.fullName}\n`),
      encoder.encode(`Amount: Rs. ${data.amount}\n`),
      encoder.encode(`Words: ${data.amountInWords}\n`),
      encoder.encode("--------------------------------\n"),
      CENTER,
      encoder.encode("Customer Copy\n"),
      FEED
    ];

    // Combine all parts into one buffer
    const totalLength = parts.reduce((acc, part) => acc + part.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const part of parts) {
      combined.set(part, offset);
      offset += part.length;
    }

    try {
      // Note: Most network printers support raw TCP on 9100. 
      // Browser 'fetch' cannot do raw TCP. 
      // However, some 'Smart' printers support an HTTP POST endpoint for raw data.
      // We attempt to send this via fetch as a fallback for smart network printers.
      const response = await fetch(`http://${this.ipAddress}/pstprnt`, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: combined
      });
      
      return response;
    } catch (error) {
      console.error("WiFi Printing Error:", error);
      // If direct IP printing fails, we fall back to system print.
      throw error;
    }
  }
}

export const wifiPrinterService = new WifiPrinterService();

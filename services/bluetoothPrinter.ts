
import { ChallanData, Language } from '../types';
import { LABELS } from '../constants';

export class BluetoothPrinterService {
  // Use any to avoid "Cannot find name" errors for Web Bluetooth types
  private device: any = null;
  private characteristic: any = null;

  async connect(): Promise<string> {
    try {
      // Cast navigator to any to access the bluetooth property which is not in the default Navigator type
      const nav = navigator as any;
      
      // Standard search for printers or generic serial devices
      const device = await nav.bluetooth.requestDevice({
        filters: [
          { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // Generic Printer Service
          { services: ['0000ff00-0000-1000-8000-00805f9b34fb'] }, // Common Thermal Printer Service
        ],
        optionalServices: [
            '0000af30-0000-1000-8000-00805f9b34fb', 
            '0000ae30-0000-1000-8000-00805f9b34fb',
            '4953544c-4a43-4e43-4c4f-5244494e4152'
        ]
      }).catch(async () => {
          // Fallback to all devices if specific filters fail (some browsers/printers are picky)
          return await nav.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [
                '000018f0-0000-1000-8000-00805f9b34fb',
                '0000ff00-0000-1000-8000-00805f9b34fb',
                '0000af30-0000-1000-8000-00805f9b34fb',
                '0000ae30-0000-1000-8000-00805f9b34fb'
            ]
          });
      });

      if (!device) throw new Error("No device selected");

      const server = await device.gatt?.connect();
      if (!server) throw new Error("Could not connect to GATT server");

      // Try to find a writable characteristic
      const services = await server.getPrimaryServices();
      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            this.device = device;
            this.characteristic = char;
            return device.name || "Bluetooth Printer";
          }
        }
      }

      throw new Error("No writable characteristic found on device");
    } catch (error) {
      console.error("Bluetooth Connection Error:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.characteristic = null;
  }

  isConnected(): boolean {
    return !!(this.device?.gatt?.connected && this.characteristic);
  }

  getDeviceName(): string {
    return this.device?.name || "";
  }

  private async write(data: Uint8Array) {
    if (!this.characteristic) return;
    
    // Most Bluetooth printers have a MTU limit, so we send in chunks
    const CHUNK_SIZE = 20;
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      await this.characteristic.writeValue(chunk);
    }
  }

  async printChallan(data: ChallanData, language: Language) {
    if (!this.isConnected()) throw new Error("Printer not connected");

    const encoder = new TextEncoder();
    
    // Basic ESC/POS commands
    const ESC = 0x1B;
    const GS = 0x1D;
    const INIT = new Uint8Array([ESC, 0x40]);
    const CENTER = new Uint8Array([ESC, 0x61, 0x01]);
    const LEFT = new Uint8Array([ESC, 0x61, 0x00]);
    const BOLD_ON = new Uint8Array([ESC, 0x45, 0x01]);
    const BOLD_OFF = new Uint8Array([ESC, 0x45, 0x00]);
    const FEED = new Uint8Array([0x0A, 0x0A, 0x0A, 0x0A]); // 4 line feeds

    const line = (text: string) => encoder.encode(text + "\n");

    try {
      await this.write(INIT);
      await this.write(CENTER);
      await this.write(BOLD_ON);
      await this.write(line("INDIA POST"));
      await this.write(line(LABELS.posb[language]));
      await this.write(line(LABELS.payInSlip[language]));
      await this.write(BOLD_OFF);
      await this.write(line("--------------------------------"));
      
      await this.write(LEFT);
      await this.write(line(`Date: ${data.date}`));
      await this.write(line(`Type: ${data.transactionType}`));
      await this.write(line(`PO: ${data.branchName}`));
      await this.write(line(`Acc No: ${data.accountNumber}`));
      await this.write(line(`Name: ${data.fullName}`));
      await this.write(line(`Amount: Rs. ${data.amount}`));
      await this.write(line(`Words: ${data.amountInWords}`));
      
      await this.write(line("--------------------------------"));
      await this.write(CENTER);
      await this.write(line("Customer Copy"));
      await this.write(FEED);
      
      // Cut command (if supported)
      await this.write(new Uint8Array([GS, 0x56, 0x01]));
      
    } catch (error) {
      console.error("Printing Error:", error);
      throw error;
    }
  }
}

export const printerService = new BluetoothPrinterService();

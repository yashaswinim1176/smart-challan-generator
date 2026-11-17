
import { Language, TranslationMap } from './types';

export const THEME_RED = '#D32F2F';

export const LABELS: TranslationMap = {
  appTitle: {
    [Language.ENGLISH]: 'Department of Posts (India)',
    [Language.HINDI]: 'भारतीय डाक विभाग',
    [Language.KANNADA]: 'ಭಾರತೀಯ ಅಂಚೆ ಇಲಾಖೆ'
  },
  selectLang: {
    [Language.ENGLISH]: 'Select Language',
    [Language.HINDI]: 'भाषा चुनें',
    [Language.KANNADA]: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ'
  },
  scanPassbook: {
    [Language.ENGLISH]: 'Scan Passbook',
    [Language.HINDI]: 'पासबुक स्कैन करें',
    [Language.KANNADA]: 'ಪಾಸ್‌ಬುಕ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ'
  },
  useCamera: {
    [Language.ENGLISH]: 'Use Camera',
    [Language.HINDI]: 'कैमरा का उपयोग करें',
    [Language.KANNADA]: 'ಕ್ಯಾಮೆರಾ ಬಳಸಿ'
  },
  capture: {
    [Language.ENGLISH]: 'Capture',
    [Language.HINDI]: 'कैप्चर',
    [Language.KANNADA]: 'ಸೆರೆಹಿಡಿಯಿರಿ'
  },
  cancel: {
    [Language.ENGLISH]: 'Cancel',
    [Language.HINDI]: 'रद्द करें',
    [Language.KANNADA]: 'ರದ್ದುಮಾಡಿ'
  },
  orManual: {
    [Language.ENGLISH]: 'Or Enter Manually',
    [Language.HINDI]: 'या मैन्युअल रूप से दर्ज करें',
    [Language.KANNADA]: 'ಅಥವಾ ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ'
  },
  generating: {
    [Language.ENGLISH]: 'Extracting Details...',
    [Language.HINDI]: 'विवरण निकाल रहा है...',
    [Language.KANNADA]: 'ವಿವರಗಳನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...'
  },
  print: {
    [Language.ENGLISH]: 'Print Challan',
    [Language.HINDI]: 'प्रिंट करें',
    [Language.KANNADA]: 'ಮುದ್ರಿಸಿ'
  },
  printPreview: {
    [Language.ENGLISH]: 'Print Preview',
    [Language.HINDI]: 'प्रिंट पूर्वावलोकन',
    [Language.KANNADA]: 'ಮುದ್ರಣ ಪೂರ್ವವೀಕ್ಷಣೆ'
  },
  confirmPrint: {
    [Language.ENGLISH]: 'Confirm & Print',
    [Language.HINDI]: 'पुष्टि करें और प्रिंट करें',
    [Language.KANNADA]: 'ಖಚಿತಪಡಿಸಿ ಮತ್ತು ಮುದ್ರಿಸಿ'
  },
  backToEdit: {
    [Language.ENGLISH]: 'Back to Edit',
    [Language.HINDI]: 'संपादन पर वापस जाएं',
    [Language.KANNADA]: 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ ತಿದ್ದಿ'
  },
  connectPrinter: {
    [Language.ENGLISH]: 'Connect Printer',
    [Language.HINDI]: 'प्रिंटर कनेक्ट करें',
    [Language.KANNADA]: 'ಪ್ರಿಂಟರ್ ಸಂಪರ್ಕಿಸಿ'
  },
  printerConnected: {
    [Language.ENGLISH]: 'Connected',
    [Language.HINDI]: 'कनेक्ट किया गया',
    [Language.KANNADA]: 'ಸಂಪರ್ಕಗೊಂಡಿದೆ'
  },
  printerErrorTitle: {
    [Language.ENGLISH]: 'Connection Failed',
    [Language.HINDI]: 'कनेक्शन विफल रहा',
    [Language.KANNADA]: 'ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ'
  },
  printerErrorDesc: {
    [Language.ENGLISH]: 'Ensure your printer is ON and reachable. For Bluetooth, pair it with your device. For WiFi, ensure you are on the same network.',
    [Language.HINDI]: 'सुनिश्चित करें कि आपका प्रिंटर चालू है और पहुंच योग्य है। ब्लूटूथ के लिए, इसे अपने डिवाइस के साथ पेयर करें। वाईफाई के लिए, सुनिश्चित करें कि आप उसी नेटवर्क पर हैं।',
    [Language.KANNADA]: 'ನಿಮ್ಮ ಪ್ರಿಂಟರ್ ಆನ್ ಆಗಿದೆ ಮತ್ತು ತಲುಪಲು ಸಾಧ್ಯವಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ. ಬ್ಲೂಟೂತ್‌ಗಾಗಿ, ಅದನ್ನು ನಿಮ್ಮ ಸಾಧನದೊಂದಿಗೆ ಜೋಡಿಸಿ. ವೈಫೈಗಾಗಿ, ನೀವು ಒಂದೇ ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿದ್ದೀರಿ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.'
  },
  wifiIp: {
    [Language.ENGLISH]: 'Printer IP Address',
    [Language.HINDI]: 'प्रिंटर आईपी पता',
    [Language.KANNADA]: 'ಪ್ರಿಂಟರ್ ಐಪಿ ವಿಳಾಸ'
  },
  wifiConnect: {
    [Language.ENGLISH]: 'Connect WiFi',
    [Language.HINDI]: 'वाईफाई कनेक्ट करें',
    [Language.KANNADA]: 'ವೈಫೈ ಸಂಪರ್ಕಿಸಿ'
  },
  // Form Labels
  posb: {
    [Language.ENGLISH]: 'POST OFFICE SAVINGS BANK',
    [Language.HINDI]: 'डाकघर बचत बैंक',
    [Language.KANNADA]: 'ಅಂಚೆ ಕಚೇರಿ ಉಳಿತಾಯ ಬ್ಯಾಂಕ್'
  },
  payInSlip: {
    [Language.ENGLISH]: 'PAY-IN SLIP',
    [Language.HINDI]: 'जमा पर्ची',
    [Language.KANNADA]: 'ಜಮಾ ಚೀಟಿ'
  },
  poName: {
    [Language.ENGLISH]: 'Name of Post Office',
    [Language.HINDI]: 'डाकघर का नाम',
    [Language.KANNADA]: 'ಅಂಚೆ ಕಚೇರಿಯ ಹೆಸರು'
  },
  accNo: {
    [Language.ENGLISH]: 'Account No.',
    [Language.HINDI]: 'खाता संख्या',
    [Language.KANNADA]: 'ಖಾತೆ ಸಂಖ್ಯೆ'
  },
  name: {
    [Language.ENGLISH]: 'Name',
    [Language.HINDI]: 'नाम',
    [Language.KANNADA]: 'नमस्ते'
  },
  rupees: {
    [Language.ENGLISH]: 'Rupees (in words)',
    [Language.HINDI]: 'रुपये (शब्दों में)',
    [Language.KANNADA]: 'ರೂಪಾಯಿಗಳು (ಪದಗಳಲ್ಲಿ)'
  },
  amountFig: {
    [Language.ENGLISH]: 'Amount ₹',
    [Language.HINDI]: 'राशि ₹',
    [Language.KANNADA]: 'ಮೊತ್ತ ₹'
  },
  sig: {
    [Language.ENGLISH]: 'Signature',
    [Language.HINDI]: 'हस्ताक्षर',
    [Language.KANNADA]: 'ಸಹಿ'
  },
  date: {
    [Language.ENGLISH]: 'Date',
    [Language.HINDI]: 'दिनांक',
    [Language.KANNADA]: 'ದಿನಾಂಕ'
  },
  schemeBotTitle: {
    [Language.ENGLISH]: 'Postal Assistant',
    [Language.HINDI]: 'डाक सहायक',
    [Language.KANNADA]: 'ಅಂಚೆ ಸಹಾಯಕ'
  },
  schemeBotPlaceholder: {
    [Language.ENGLISH]: 'Ask about interest rates (SSA, PPF, RD)...',
    [Language.HINDI]: 'ब्याज दरों के बारे में पूछें...',
    [Language.KANNADA]: 'ಬಡ್ಡಿ ದರಗಳ ಬಗ್ಗೆ ಕೇಳಿ...'
  },
  enterAmount: {
    [Language.ENGLISH]: 'Enter Amount',
    [Language.HINDI]: 'राशि दर्ज करें',
    [Language.KANNADA]: 'ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ'
  }
};

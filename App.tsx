
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Printer, ArrowRight, CheckCircle2, RefreshCcw, IndianRupee, X, Bluetooth, BluetoothConnected, Loader2, FileText, ChevronLeft, Trash2, AlertCircle, Info, Wifi, Settings } from 'lucide-react';
import { Language, ChallanData, TransactionType, PrinterType } from './types';
import { LABELS, THEME_RED } from './constants';
import { ChallanSlip } from './components/ChallanSlip';
import { Assistant } from './components/Assistant';
import { extractPassbookData, convertToRegionalWords } from './services/geminiService';
import { numToEnglish } from './utils/numberUtils';
import { printerService } from './services/bluetoothPrinter';
import { wifiPrinterService } from './services/wifiPrinter';

const STORAGE_KEYS = {
  DATA: 'india_post_challan_data',
  LANG: 'india_post_challan_lang',
  STEP: 'india_post_challan_step',
  WIFI_IP: 'india_post_wifi_ip',
  PRINTER_TYPE: 'india_post_printer_type'
};

const INITIAL_DATA: ChallanData = {
  fullName: '',
  accountNumber: '',
  branchName: '',
  amount: '',
  amountInWords: '',
  date: new Date().toISOString().split('T')[0],
  transactionType: TransactionType.WITHDRAWAL
};

const LandingLogo = () => (
    <div className="w-48 h-32 mx-auto mb-6 flex items-center justify-center transform transition-transform hover:scale-105 duration-300">
        <svg viewBox="0 0 140 100" className="w-full h-full drop-shadow-xl overflow-visible">
             <circle cx="50" cy="50" r="48" fill="#DA251C" />
             <path d="M 6 38 Q 35 68 120 25 L 135 28 Q 40 78 6 45 Z" fill="#FFEB3B" />
             <path d="M 16 52 Q 40 78 125 35 L 138 38 Q 45 88 16 60 Z" fill="#FFEB3B" />
             <path d="M 28 65 Q 48 88 115 48 L 125 50 Q 52 95 28 72 Z" fill="#FFEB3B" />
        </svg>
    </div>
);

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language | null>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || null;
  });
  const [step, setStep] = useState<'lang' | 'upload' | 'form'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.STEP) as any) || 'lang';
  });
  const [data, setData] = useState<ChallanData>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DATA);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Printer state
  const [printerType, setPrinterType] = useState<PrinterType>(() => {
    return (localStorage.getItem(STORAGE_KEYS.PRINTER_TYPE) as PrinterType) || PrinterType.BLUETOOTH;
  });
  const [wifiIp, setWifiIp] = useState(() => localStorage.getItem(STORAGE_KEYS.WIFI_IP) || '');
  const [isPrinterConnected, setIsPrinterConnected] = useState(false);
  const [printerName, setPrinterName] = useState("");
  const [isConnectingPrinter, setIsConnectingPrinter] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printerError, setPrinterError] = useState<{ title: string, desc: string } | null>(null);
  const [isPrinterSettingsOpen, setIsPrinterSettingsOpen] = useState(false);

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (language) localStorage.setItem(STORAGE_KEYS.LANG, language);
    else localStorage.removeItem(STORAGE_KEYS.LANG);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STEP, step);
  }, [step]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRINTER_TYPE, printerType);
  }, [printerType]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WIFI_IP, wifiIp);
    wifiPrinterService.setIpAddress(wifiIp);
  }, [wifiIp]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const fullResetToHome = () => {
    setData(INITIAL_DATA);
    setLanguage(null);
    setStep('lang');
    localStorage.removeItem(STORAGE_KEYS.DATA);
    localStorage.removeItem(STORAGE_KEYS.LANG);
    localStorage.setItem(STORAGE_KEYS.STEP, 'lang');
    setIsPreviewOpen(false);
  };

  const handleConnectPrinter = async () => {
    setPrinterError(null);
    setIsConnectingPrinter(true);
    try {
      if (printerType === PrinterType.BLUETOOTH) {
        const name = await printerService.connect();
        setPrinterName(name);
        setIsPrinterConnected(true);
        setIsPrinterSettingsOpen(false);
      } else {
        // WiFi connection is IP based, we just verify format here
        if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(wifiIp)) {
          throw new Error("Invalid IP format");
        }
        setPrinterName(`WiFi: ${wifiIp}`);
        setIsPrinterConnected(true);
        setIsPrinterSettingsOpen(false);
      }
    } catch (error: any) {
      console.error("Printer connection error:", error);
      
      let errorTitle = LABELS.printerErrorTitle[language || Language.ENGLISH];
      let errorDesc = LABELS.printerErrorDesc[language || Language.ENGLISH];

      if (error.name === 'NotFoundError') {
        errorDesc = "No printer was selected. Please try again.";
      } else if (error.message === "Invalid IP format") {
        errorDesc = "Please enter a valid IP address (e.g. 192.168.1.100).";
      }

      setPrinterError({ title: errorTitle, desc: errorDesc });
    } finally {
      setIsConnectingPrinter(false);
    }
  };

  const triggerActualPrint = async () => {
    if (isPrinterConnected) {
      setIsPrinting(true);
      try {
        if (printerType === PrinterType.BLUETOOTH) {
          await printerService.printChallan(data, language!);
        } else {
          await wifiPrinterService.printChallan(data, language!);
        }
        setTimeout(fullResetToHome, 1000);
      } catch (error) {
        setPrinterError({ 
          title: "Print Failed", 
          desc: "Could not send data to the printer. Falling back to system print." 
        });
        window.print();
        setTimeout(fullResetToHome, 2000);
      } finally {
        setIsPrinting(false);
      }
    } else {
      window.print();
      setTimeout(fullResetToHome, 2000);
    }
  };

  const handlePrintRequest = () => {
    setIsPreviewOpen(true);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        stopCamera();
        processImage(base64);
      }
    }
  };

  const processImage = async (base64: string) => {
    setIsProcessing(true);
    try {
        const result = await extractPassbookData(base64);
        setData(prev => ({
            ...prev,
            fullName: result.fullName || prev.fullName,
            accountNumber: result.accountNumber || prev.accountNumber,
            branchName: result.branchName || prev.branchName
        }));
        setStep('form');
    } catch (error) {
        alert("Failed to process image. Please enter details manually.");
        setStep('form');
    } finally {
        setIsProcessing(false);
    }
  };

  const updateData = async (field: keyof ChallanData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);

    if (field === 'amount') {
        const num = parseInt(value);
        if (isNaN(num) || value === '') {
            setData(prev => ({ ...prev, amountInWords: '', amount: value }));
            return;
        }

        const englishWords = numToEnglish(num);

        if (language === Language.ENGLISH) {
            setData(prev => ({ ...prev, amountInWords: englishWords }));
        } else {
            setIsTranslating(true);
            setData(prev => ({ ...prev, amountInWords: englishWords + '...' }));
            const regionalWords = await convertToRegionalWords(value, language!);
            setData(prev => ({ ...prev, amountInWords: regionalWords }));
            setIsTranslating(false);
        }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        processImage(base64);
    };
  };

  const handleNewScan = () => {
    if (window.confirm("Start a new session? You will be taken back to the home page.")) {
      fullResetToHome();
    }
  };

  if (!language || step === 'lang') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl text-center border-t-8" style={{borderColor: THEME_RED}}>
            <LandingLogo />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Department of Posts</h1>
            <p className="text-gray-500 mb-8">Smart Challan Generation System</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { l: Language.ENGLISH, label: 'English', sub: 'Welcome' },
                    { l: Language.HINDI, label: 'हिंदी', sub: 'स्वागत है' },
                    { l: Language.KANNADA, label: 'ಕನ್ನಡ', sub: 'ಸ್ವಾಗತ' }
                ].map((opt) => (
                    <button 
                        key={opt.l}
                        onClick={() => { setLanguage(opt.l); setStep('upload'); }}
                        className="p-6 rounded-xl border-2 border-gray-100 hover:border-red-500 hover:bg-red-50 transition-all group"
                    >
                        <div className="text-2xl font-bold text-gray-800 group-hover:text-red-700 mb-1">{opt.label}</div>
                        <div className="text-sm text-gray-400">{opt.sub}</div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    );
  }

  if (step === 'upload') {
      return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{LABELS.scanPassbook[language]}</h2>
                
                {isCameraOpen ? (
                     <div className="relative bg-black rounded-xl overflow-hidden mb-6 aspect-[4/3]">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                        
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                            <button 
                                onClick={stopCamera}
                                className="bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/30"
                            >
                                <X size={24} />
                            </button>
                            <button 
                                onClick={captureImage}
                                className="bg-white text-red-600 p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
                            >
                                <Camera size={32} />
                            </button>
                        </div>
                     </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                         <button 
                            onClick={startCamera}
                            disabled={isProcessing}
                            className="h-40 border-2 border-dashed border-red-200 rounded-xl flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 transition-colors group"
                        >
                            {isProcessing ? (
                                <RefreshCcw className="animate-spin text-red-600 mb-2" size={32} />
                            ) : (
                                <Camera className="text-red-400 group-hover:text-red-600 mb-2 transition-colors" size={32} />
                            )}
                            <span className="text-red-700 font-semibold">{LABELS.useCamera[language]}</span>
                        </button>

                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessing}
                            className="h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors group"
                        >
                            <Upload className="text-gray-400 group-hover:text-gray-600 mb-2 transition-colors" size={32} />
                            <span className="text-gray-600 font-semibold">Upload File</span>
                        </button>
                    </div>
                )}
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                />

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div>
                </div>

                <button 
                    onClick={() => setStep('form')}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                    {LABELS.orManual[language]} <ArrowRight size={18} />
                </button>
            </div>
            <button onClick={() => { setLanguage(null); setStep('lang'); }} className="mt-6 text-gray-500 underline text-sm">Back to Language</button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow-sm border-b no-print sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={handleNewScan} className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold hover:bg-red-700 transition-colors">IP</button>
                    <span className="font-bold text-gray-800 hidden sm:block">{LABELS.appTitle[language]}</span>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Printer Connection UI */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsPrinterSettingsOpen(!isPrinterSettingsOpen)}
                            className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${isPrinterConnected ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'}`}
                        >
                            {isPrinterConnected ? (
                                printerType === PrinterType.BLUETOOTH ? <BluetoothConnected size={14} /> : <Wifi size={14} />
                            ) : (
                                <Settings size={14} />
                            )}
                            <span className="font-semibold uppercase">
                                {isPrinterConnected ? `${printerName}` : LABELS.connectPrinter[language]}
                            </span>
                        </button>
                        
                        {isPrinterSettingsOpen && (
                            <div className="absolute top-full mt-2 right-0 w-72 bg-white p-4 rounded-xl shadow-2xl border border-gray-100 animate-fade-in-up z-50">
                                <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                                    <button 
                                        onClick={() => setPrinterType(PrinterType.BLUETOOTH)}
                                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-all ${printerType === PrinterType.BLUETOOTH ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <Bluetooth size={14} /> Bluetooth
                                    </button>
                                    <button 
                                        onClick={() => setPrinterType(PrinterType.WIFI)}
                                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-all ${printerType === PrinterType.WIFI ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <Wifi size={14} /> WiFi
                                    </button>
                                </div>

                                {printerType === PrinterType.WIFI && (
                                    <div className="mb-4">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{LABELS.wifiIp[language]}</label>
                                        <input 
                                            type="text" 
                                            value={wifiIp}
                                            onChange={(e) => setWifiIp(e.target.value)}
                                            placeholder="192.168.1.100"
                                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                <button 
                                    onClick={handleConnectPrinter}
                                    disabled={isConnectingPrinter}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700"
                                >
                                    {isConnectingPrinter ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                    {printerType === PrinterType.BLUETOOTH ? LABELS.connectPrinter[language] : LABELS.wifiConnect[language]}
                                </button>
                            </div>
                        )}

                        {printerError && (
                            <div className="absolute top-full mt-2 right-0 w-64 bg-white p-4 rounded-xl shadow-2xl border border-red-100 animate-fade-in-up z-50">
                                <div className="flex items-start gap-2 text-red-600 mb-1">
                                    <AlertCircle size={18} className="shrink-0" />
                                    <span className="font-bold text-sm">{printerError.title}</span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed mb-2">{printerError.desc}</p>
                                <button onClick={() => setPrinterError(null)} className="text-xs font-bold text-gray-400 hover:text-gray-600">Dismiss</button>
                            </div>
                        )}
                    </div>

                     <button 
                        onClick={handleNewScan}
                        className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1 mx-2 transition-colors"
                     >
                        <RefreshCcw size={14} /> New Scan
                    </button>
                    <button 
                        onClick={handlePrintRequest} 
                        className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                    >
                        <FileText size={18} />
                        <span className="hidden sm:inline">{LABELS.print[language]}</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4 md:p-8 overflow-auto">
            <div className="max-w-[297mm] mx-auto bg-white shadow-2xl challan-container flex flex-col md:flex-row print:flex-row print:w-full print:h-[210mm] print:shadow-none print:m-0">
                <div className="flex-1 p-2 md:p-4 border-r-2 border-dashed border-gray-300 print:border-gray-800 relative">
                     <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-100 rounded-full z-10 hidden md:block print:hidden">
                        <div className="w-full h-full border-r-2 border-dashed border-gray-300"></div>
                     </div>
                     <ChallanSlip 
                        type="Customer Copy" 
                        data={data} 
                        language={language} 
                        onChange={updateData} 
                    />
                </div>

                <div className="flex-1 p-2 md:p-4">
                    <ChallanSlip 
                        type="Post Office Copy" 
                        data={data} 
                        language={language} 
                        onChange={updateData} 
                    />
                </div>
            </div>

            <div className="max-w-[297mm] mx-auto mt-8 flex justify-center no-print">
                <button 
                    onClick={handlePrintRequest}
                    className="flex items-center gap-3 px-12 py-5 bg-[#D32F2F] text-white rounded-2xl font-bold text-xl shadow-xl hover:bg-[#B71C1C] transition-all transform active:scale-95 group"
                >
                    <Printer size={28} className="group-hover:rotate-12 transition-transform" />
                    Print Draft
                </button>
            </div>
        </div>

        {/* Print Preview Modal */}
        {isPreviewOpen && (
            <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm flex flex-col items-center p-4 overflow-y-auto">
                <div className="w-full max-w-7xl flex items-center justify-between mb-6 no-print">
                    <button 
                        onClick={() => setIsPreviewOpen(false)}
                        className="text-white flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                        {LABELS.backToEdit[language]}
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white hidden sm:block">{LABELS.printPreview[language]}</h2>
                        <button 
                            onClick={triggerActualPrint}
                            disabled={isPrinting}
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg transition-transform active:scale-95 disabled:opacity-70"
                        >
                            {isPrinting ? <Loader2 size={24} className="animate-spin" /> : <Printer size={24} />}
                            {LABELS.confirmPrint[language]}
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow-2xl overflow-hidden p-8 rounded-lg max-w-[297mm] w-full print-visible print-only-challan">
                     <div className="flex flex-col md:flex-row w-full gap-8 border-2 border-gray-100 p-4 challan-container">
                        <div className="flex-1 border-r-2 border-dashed border-gray-200 pr-4">
                            <ChallanSlip 
                                type="Customer Copy" 
                                data={data} 
                                language={language} 
                                onChange={() => {}} 
                            />
                        </div>
                        <div className="flex-1">
                            <ChallanSlip 
                                type="Post Office Copy" 
                                data={data} 
                                language={language} 
                                onChange={() => {}} 
                            />
                        </div>
                     </div>
                </div>

                <div className="mt-8 text-white/50 text-sm no-print text-center flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white/80">
                        <Info size={16} />
                        <span>A4 Landscape recommended for best results.</span>
                    </div>
                    <p className="mt-1">{isPrinterConnected ? `Printing will be sent to: ${printerName}` : "Browser print dialog will open for A4 Landscape printing."}</p>
                </div>
            </div>
        )}

        <Assistant language={language} />
    </div>
  );
};

export default App;

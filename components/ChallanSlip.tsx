
import React from 'react';
import { ChallanData, Language, TransactionType } from '../types';
import { LABELS } from '../constants';

interface SlipProps {
    type: 'Customer Copy' | 'Post Office Copy';
    data: ChallanData;
    language: Language;
    onChange: (field: keyof ChallanData, value: string) => void;
}

// Custom SVG Component for the Logo provided
const IndiaPostLogoSVG = () => (
    <div className="flex flex-col items-center justify-center pointer-events-none select-none w-40">
        {/* Logo Symbol */}
        <div className="relative w-16 h-16 mb-1">
           <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                {/* Red Circle */}
                <circle cx="50" cy="50" r="48" fill="#D32F2F" />
                
                {/* Yellow Wings - Stylized representation of the India Post bird/wings */}
                <path d="M 15 40 Q 40 55 90 28 L 98 32 Q 45 65 15 48 Z" fill="#FFEB3B" />
                <path d="M 22 52 Q 45 65 88 38 L 96 42 Q 50 75 22 60 Z" fill="#FFEB3B" />
                <path d="M 28 64 Q 50 75 86 48 L 94 52 Q 55 85 28 72 Z" fill="#FFEB3B" />
           </svg>
        </div>
        
        {/* Text Stack */}
        <div className="text-center leading-none w-full">
            <h1 className="text-[#D32F2F] font-serif font-bold text-[11px] sm:text-[12px] tracking-wide scale-y-110 mb-1">
                INDIA POST PAYMENT BANK
            </h1>
            <div className="flex items-center justify-center gap-1">
                <div className="h-px bg-black w-full opacity-80"></div>
                <h2 className="text-black font-serif text-[9px] whitespace-nowrap font-bold px-1 opacity-90">
                    प्रगति आपकी, विश्वास हमारा
                </h2>
                <div className="h-px bg-black w-full opacity-80"></div>
            </div>
        </div>
    </div>
);

export const ChallanSlip: React.FC<SlipProps> = ({ type, data, language, onChange }) => {
    
    // Handlers for input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange(name as keyof ChallanData, value);
    };

    return (
        <div className="border-2 border-gray-800 p-4 relative bg-white h-full flex flex-col justify-between">
            {/* Header */}
            <div className="border-b-2 border-red-800 pb-2 mb-4">
                <div className="flex justify-between items-start mb-2">
                    {/* Replaced generic img with the specific SVG Logo Component */}
                    <div className="-mt-1 -ml-2">
                        <IndiaPostLogoSVG />
                    </div>
                    
                    <div className="text-right pt-2">
                        <h1 className="text-red-700 font-bold text-sm sm:text-base uppercase tracking-wide print-bg-red">{LABELS.posb[language]}</h1>
                        <h2 className="text-xs font-bold text-gray-600 uppercase tracking-widest">{LABELS.payInSlip[language]} (SB-103)</h2>
                    </div>
                </div>
                <div className="flex justify-between items-end mt-2">
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-semibold border border-gray-300 uppercase">{type}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{LABELS.date[language]}:</span>
                        <input 
                            type="date" 
                            name="date"
                            value={data.date} 
                            onChange={handleChange}
                            className="font-handwritten text-lg border-b border-gray-400 focus:border-red-600 outline-none w-32 bg-transparent text-center transition-colors duration-200 py-0.5"
                        />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="space-y-4 flex-grow">
                {/* Branch */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 uppercase font-semibold">{LABELS.poName[language]}</label>
                    <input 
                        type="text" 
                        name="branchName"
                        value={data.branchName}
                        onChange={handleChange}
                        className="font-handwritten text-xl w-full border-b border-gray-300 focus:border-red-600 outline-none bg-transparent py-1 transition-colors duration-200 placeholder-gray-300"
                        placeholder="................................................"
                    />
                </div>

                {/* Account Type Selection (Visual only for print mainly) */}
                <div className="flex gap-4 my-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 border border-black rounded-full flex items-center justify-center bg-black`}>
                             <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm font-bold">Withdrawal</span>
                    </div>
                </div>

                {/* Account Number */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 uppercase font-semibold">{LABELS.accNo[language]}</label>
                    <div className="flex gap-1 mt-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className={`flex-1 aspect-[3/4] border ${data.accountNumber.length > i ? 'border-gray-800 bg-white' : 'border-gray-300 bg-gray-50'} rounded-md flex items-center justify-center relative overflow-hidden transition-colors duration-200`}>
                                <span className="font-handwritten text-2xl font-bold text-gray-800 z-10">
                                    {data.accountNumber[i] || ''}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Hidden input for binding */}
                    <input 
                        type="text" 
                        name="accountNumber"
                        value={data.accountNumber}
                        onChange={(e) => {
                            if (e.target.value.length <= 10 && /^\d*$/.test(e.target.value)) {
                                handleChange(e);
                            }
                        }}
                        className="absolute opacity-0 w-full h-12 -mt-12 cursor-text"
                        maxLength={10}
                        autoComplete="off"
                    />
                </div>

                {/* Name */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 uppercase font-semibold">{LABELS.name[language]}</label>
                    <input 
                        type="text" 
                        name="fullName"
                        value={data.fullName}
                        onChange={handleChange}
                        className="font-handwritten text-xl w-full border-b border-gray-300 focus:border-red-600 outline-none bg-transparent py-1 transition-colors duration-200 placeholder-gray-300"
                        placeholder="................................................"
                    />
                </div>

                {/* Amount Words */}
                <div className="bg-red-50 p-3 rounded border border-red-100">
                    <label className="text-xs text-red-500 uppercase font-semibold block mb-1">{LABELS.rupees[language]}</label>
                    <div className="font-handwritten text-lg leading-tight text-gray-800 break-words min-h-[1.5em]">
                        {data.amountInWords || "................................................"} Only
                    </div>
                </div>

                {/* Amount Figures */}
                <div className="flex justify-end items-center gap-4 pt-2 border-t border-dashed border-gray-300">
                    <span className="font-bold text-gray-700">{LABELS.amountFig[language]}</span>
                    <div className="border-2 border-gray-800 px-4 py-2 rounded bg-white w-40 flex items-center focus-within:ring-2 focus-within:ring-red-200 transition-shadow">
                        <span className="text-gray-500 mr-1">₹</span>
                        <input 
                            type="number"
                            name="amount"
                            value={data.amount}
                            onChange={handleChange}
                            className="font-handwritten text-2xl font-bold w-full outline-none bg-transparent text-right placeholder-gray-300"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-end">
                <div className="text-[10px] text-gray-400 max-w-[50%]">
                    This slip is valid for POSB transactions subject to realization of cheque/draft.
                </div>
                <div className="text-center">
                    <div className="h-10 w-32 border-b border-gray-400 mb-1"></div>
                    <span className="text-xs font-bold uppercase text-gray-600">{LABELS.sig[language]}</span>
                </div>
            </div>
        </div>
    );
};

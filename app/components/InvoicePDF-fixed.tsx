import { Totals, Invoice } from '@/type'
import { ArrowDownFromLine } from 'lucide-react'
import React, { useRef } from 'react'
import { LayersPlus } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

interface FacturePDFProps {
    invoice: Invoice
    totals: Totals
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

const InvoicePDF: React.FC<FacturePDFProps> = ({ invoice, totals }) => {
    const factureRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        const element = factureRef.current;
        if (element) {
            try {
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: true,
                    allowTaint: true
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4"
                });

                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`facture-${invoice.name}.pdf`);

                // Animation de confettis
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    zIndex: 9999
                });

            } catch (error) {
                console.error('Erreur lors de la génération du PDF:', error);
            }
        }
    };

    return (
        <div className='mt-4 hidden lg:block'>
            <div className='border-base-300 border-2 border-dashed rounded-xl p-5'>
                <button
                    className='btn btn-sm btn-primary mb-4'
                    onClick={handleDownloadPdf}
                >
                    Facture PDF
                    <ArrowDownFromLine className='w-4' />
                </button>

                <div className='p-8' ref={factureRef}>
                    <div className='flex justify-between items-center text-sm'>
                        <div className='flex flex-col'>
                            <div className='flex items-center'>
                                <div className="bg-info-content text-info rounded-full p-5">
                                    <LayersPlus className="h-6 w-6" />
                                </div>
                                <span className="ml-3 font-bold text-2xl italic">
                                    Factu<span className="text-info">Pro</span>
                                </span>
                            </div>
                            <h1 className='text-7xl font-bold uppercase'>Facture</h1>
                        </div>

                        <div className='text-right uppercase'>
                            <p className='badge badge-ghost'>
                                Facture ° {invoice.id}
                            </p>
                            <p className='my-2'>
                                <strong>Date </strong>
                                {formatDate(invoice.invoiceDate)}
                            </p>
                            <p>
                                <strong>Date d'écheance </strong>
                                {formatDate(invoice.dueDate)}
                            </p>
                        </div>
                    </div>

                    <div className='my-6 flex justify-between'>
                        <div>
                            <p className='badge badge-ghost mb-2'>Emetteur</p>
                            <p className='text-sm font-bold italic'>{invoice.issuerName}</p>
                            <p className='text-sm text-gray-500 w-52 break-words'>{invoice.issuerAddress}</p>
                        </div>
                        <div className='text-right'>
                            <p className='badge badge-ghost mb-2'>Client</p>
                            <p className='text-sm font-bold italic'>{invoice.clientName}</p>
                            <p className='text-sm text-gray-500 w-52 break-words'>{invoice.clientAddress}</p>
                        </div>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='table table-zebra'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Description</th>
                                    <th>Quantité</th>
                                    <th>Prix Unitaire</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.lines?.map((line, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{line.description}</td>
                                        <td>{line.quantity}</td>
                                        <td>{line.unitPrice.toFixed(2)} €</td>
                                        <td>{(line.quantity * line.unitPrice).toFixed(2)} €</td>
                                    </tr>
                                )) || (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4">Aucune ligne de facture</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>

                    <div className='mt-6 space-y-2 text-md'>
                        <div className='flex justify-between'>
                            <div className='font-bold'>Total Hors Taxes</div>
                            <div>{totals.totalHT.toFixed(2)} €</div>
                        </div>

                        {invoice.vatActive && (
                            <div className='flex justify-between'>
                                <div className='font-bold'>TVA {invoice.vatRate}%</div>
                                <div>{totals.totalVAT.toFixed(2)} €</div>
                            </div>
                        )}

                        <div className='flex justify-between'>
                            <div className='font-bold'>Total Toutes Taxes Comprises</div>
                            <div className='badge badge-primary'>{totals.totalTTC.toFixed(2)} €</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePDF;

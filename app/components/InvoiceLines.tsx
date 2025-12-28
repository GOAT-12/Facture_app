import React, { useCallback } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Invoice, type InvoiceLine } from '@/type';
import { logger } from '@/lib/logger';

interface Props {
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
}

const InvoiceLines: React.FC<Props> = ({ invoice, setInvoice }) => {
  const handleAddLine = useCallback(() => {
    try {
      const newLine: InvoiceLine = {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        invoiceId: invoice.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setInvoice({
        ...invoice,
        lines: [...invoice.lines, newLine],
      });
    } catch (error) {
      logger.error('Failed to add invoice line', { error });
    }
  }, [invoice, setInvoice]);

  const handleRemoveLine = useCallback((index: number) => {
    try {
      if (index < 0 || index >= invoice.lines.length) {
        throw new Error('Invalid line index');
      }

      const newLines = invoice.lines.filter((_, i) => i !== index);
      setInvoice({ ...invoice, lines: newLines });
    } catch (error) {
      logger.error('Failed to remove invoice line', { error, index });
    }
  }, [invoice, setInvoice]);

  const handleQuantityChange = useCallback((index: number, value: string) => {
    try {
      const quantity = value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);

      setInvoice(prevInvoice => {
        const updatedLines = [...prevInvoice.lines];
        updatedLines[index] = { ...updatedLines[index], quantity };
        return { ...prevInvoice, lines: updatedLines };
      });
    } catch (error) {
      logger.error('Failed to update quantity', { error, index, value });
    }
  }, [setInvoice]);

  const handleDescriptionChange = useCallback((index: number, value: string) => {
    try {
      setInvoice(prevInvoice => {
        const updatedLines = [...prevInvoice.lines];
        updatedLines[index] = { ...updatedLines[index], description: value };
        return { ...prevInvoice, lines: updatedLines };
      });
    } catch (error) {
      logger.error('Failed to update description', { error, index, value });
    }
  }, [setInvoice]);

  const handleUnitPriceChange = useCallback((index: number, value: string) => {
    try {
      // Remplacer les virgules par des points et convertir en nombre
      const numericValue = parseFloat(
        value.replace(',', '.').replace(/[^0-9.-]+/g, '')
      ) || 0;

      // Arrondir à 2 décimales
      const roundedValue = Math.round(numericValue * 100) / 100;

      setInvoice(prevInvoice => {
        const updatedLines = [...prevInvoice.lines];
        updatedLines[index] = { ...updatedLines[index], unitPrice: roundedValue };
        return { ...prevInvoice, lines: updatedLines };
      });
    } catch (error) {
      logger.error('Failed to update unit price', { error, index, value });
    }
  }, [setInvoice]);

  const updateLine = useCallback((
    index: number,
    field: keyof InvoiceLine,
    value: string | number
  ) => {
    try {
      setInvoice(prevInvoice => {
        const newLines = [...prevInvoice.lines];

        // Validation du type en fonction du champ
        if (field === 'quantity') {
          newLines[index] = {
            ...newLines[index],
            [field]: typeof value === 'string' ? parseInt(value, 10) || 0 : value
          };
        } else if (field === 'unitPrice') {
          const numericValue = typeof value === 'string' ?
            parseFloat(value) || 0 :
            value;
          newLines[index] = {
            ...newLines[index],
            [field]: Math.round(numericValue * 100) / 100 // Arrondir à 2 décimales
          };
        } else {
          newLines[index] = {
            ...newLines[index],
            [field]: value
          };
        }

        return { ...prevInvoice, lines: newLines };
      });
    } catch (error) {
      logger.error('Failed to update line', { error, index, field, value });
    }
  }, [setInvoice]);

  return (
    <div className="h-fit bg-base-200 rounded-xl w-full p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="badge badge-info">Produit / Services</h1>
        <button className="btn btn-sm btn-info" onClick={handleAddLine}>
          <Plus className="w-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="uppercase">
            <tr>
              <th>Quantité</th>
              <th>Description</th>
              <th>Prix Unitaire (HT)</th>
              <th>Montant (HT)</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {invoice.lines.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center opacity-60">
                  Aucune ligne
                </td>
              </tr>
            )}

            {invoice.lines.map((line, index) => (
              <tr key={line.id}>
                <td>
                  <input
                    type="number"
                    value={line.quantity}

                    className="input input-sm input-bordered w-full"
                    min={0}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }

                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={line.description}

                    className="input input-sm input-bordered w-full"
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={line.unitPrice}

                    className="input input-sm input-bordered w-full"
                    min={0}
                    step={0.01}
                    onChange={(e) =>
                      handleUnitPriceChange(index, e.target.value)
                    }
                  />
                </td>

                <td className="font-bold">
                  {(line.quantity * line.unitPrice).toFixed(2)} €
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-circle btn-info"
                    onClick={() => handleRemoveLine(index)}
                  >
                    <Trash className="w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvoiceLines

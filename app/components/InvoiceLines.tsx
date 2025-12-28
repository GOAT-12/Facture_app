import React from 'react'
import { Invoice } from '@/type'
import { Plus, Trash } from 'lucide-react'
import { InvoiceLine } from '@prisma/client'

interface Props {
  invoice: Invoice
  setInvoice: (invoice: Invoice) => void
}

const InvoiceLines: React.FC<Props> = ({ invoice, setInvoice }) => {

  const handleAddLine = () => {
    const newLine: InvoiceLine = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      invoiceId: invoice.id
    }

    setInvoice({
      ...invoice,
      lines: [...invoice.lines, newLine]
    })
  }

  const handleRemoveLine = (index: number) => {
    const newLines = invoice.lines.filter((_, i) => i !== index)
    setInvoice({ ...invoice, lines: newLines })
  }

  const handleQuantityChange = (index: number, value: string) => {
    const updatedLines = [...invoice.lines]
    updatedLines[index].quantity = value === "" ? 0 : parseInt(value)
    setInvoice({ ...invoice, lines: updatedLines })
  }

  const handleDescriptionChange = (index: number, value: string) => {
    const updatedLines = [...invoice.lines]
    updatedLines[index].description = value
    setInvoice({ ...invoice, lines: updatedLines })
  }

  const handleUnitPriceChange = (index: number, value: string) => {
    const updatedLines = [...invoice.lines]
    updatedLines[index].unitPrice = value === "" ? 0 : parseFloat(value)
    setInvoice({ ...invoice, lines: updatedLines })
  }

  const updateLine = (
    index: number,
    field: keyof InvoiceLine,
    value: string | number
  ) => {
    const newLines = [...invoice.lines]
    // @ts-ignore
    newLines[index][field] = value
    setInvoice({ ...invoice, lines: newLines })
  }

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

import React from 'react'
import { Invoice } from '@/type'

interface Props {
  invoice: Invoice
  setInvoice: (invoice: Invoice) => void
}

const MIN_VAT = 20

const VATControl: React.FC<Props> = ({ invoice, setInvoice }) => {

  const handleVATChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    setInvoice({
      ...invoice,
      vatActive: checked,
      vatRate: checked ? Math.max(invoice.vatRate || MIN_VAT, MIN_VAT) : 0
    })
  }

  const handleVATRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(MIN_VAT, Number(e.target.value))

    setInvoice({
      ...invoice,
      vatRate: value
    })
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-bold">TVA (%)</label>

      <input
        type="checkbox"
        className="toggle toggle-sm"
        checked={invoice.vatActive}
        onChange={handleVATChange}
      />

      {invoice.vatActive && (
        <input
          type="number"
          min={MIN_VAT}
          value={invoice.vatRate}
          onChange={handleVATRateChange}
          className="input input-sm input-bordered w-20"
        />
      )}
    </div>
  )
}

export default VATControl

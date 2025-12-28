
"use client"

import Wrapper from './components/wrapper';
import { LayersPlus } from "lucide-react";
import { useState, useEffect } from 'react';
import { createEmptyInvoice, getInvoicesByEmail } from './actions';
import { useUser } from "@clerk/nextjs";
import confetti from 'canvas-confetti';
import {Invoice} from "../type"
import InvoiceComponent from './components/invoiceComponent';

export default function Home() {
  const {user} = useUser();
  const [invoiceName, setInvoiceName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const fetchInvoices = async () => {
    try {
      const data =  await getInvoicesByEmail(email)
      if(data){
        setInvoices(data)
      }
      
    } catch (error) {
      console.log("Erreur lors du chargement d ela facture ", error);
    }
  }

  useEffect(() => {
    fetchInvoices();
  }, [email]);


  useEffect(() => {
    setIsNameValid(invoiceName.length <= 60);
  }, [invoiceName]);

  const handleCreateInvoice = async () => {
    try {
      if(email){
        await createEmptyInvoice(email,  invoiceName);
      }
      fetchInvoices();
      setInvoiceName('');
       const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
       if (modal) {modal.close();}
       confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            y: 0.6,
          },
          zIndex: 9999
       })
      
    } catch (error) {
      console.log("Erreur lors de la creation de la facture", error);
    }
  }
  return (
    <Wrapper>
      <div className='flex flex-col space-y-4'>
        <h1 className='text-lg font-bold'>Mes factures</h1>
        <div className='grid md:grid-cols-3 gap-4'>
          <div className="cursor-pointer border border-primary rounded-xl flex flex-col justify-center items-center p-5" onClick={() => {
  const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
  if (modal) modal.showModal();
}}>
  <div className='font-bold text-info'>
    Créer une facture
  </div>
  <div className="bg-info-content text-info rounded-full p-5 mt-3">
            <LayersPlus className="h-6 w-6" />

          </div>

      </div>
    {invoices.length > 0 && (
      invoices.map((invoice , index) =>
        <div key={index}>
          <InvoiceComponent invoice={invoice} index={index}/>
        </div>
      )
    )}
        </div>


<dialog id="my_modal_2" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Nouvelle facture</h3>
    <input 
     type="text" 
     placeholder='nom de la facture (max 60 caractères)'
     className='input input-bordered w-full my-4'
     value={invoiceName}
     onChange={(e) => {
      setInvoiceName(e.target.value);
      setIsNameValid(e.target.value.length <= 60);
     }}
     />
   
{!isNameValid && <p className='text-red-500 mb-4 text-sm' >Le nom de la facture ne peut pas depasser 60 caractères</p>}

<button 
    className='btn btn-info'
    disabled={!isNameValid || invoiceName.trim() === ''}
     onClick={handleCreateInvoice}
    >
      Créer</button>
  </div>
  
    
  
</dialog>

      </div>
    </Wrapper>
  );
}

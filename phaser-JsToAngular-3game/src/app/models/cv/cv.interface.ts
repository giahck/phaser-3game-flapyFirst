export interface Cv {
    id: number;
    cognome: string;
    nome: string;
    email: string;
    telefono: string;
    indirizzo: string;
    titolo: string;
    esperienze: Esperienza[];
    formazioni: Formazione[];
    [key: string]: any;
  }
  
  export interface Esperienza {
    nome: string;
    luogo: string;
    dataInizio: Date;
    dataFine: Date;
    descrizione: string;
  }
  
  export interface Formazione {
    nome: string;
    luogo: string;
    dataInizio: Date;
    dataFine: Date;
    descrizione: string;
  }
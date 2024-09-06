export interface Cv {
  nome: string;
    id: number;
    cognome: string;
    email: string;
    telefono: string;
    indirizzo: string;
    titolo: string;
    esperienze: Esperienza[];
    formazioni: Formazione[];
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
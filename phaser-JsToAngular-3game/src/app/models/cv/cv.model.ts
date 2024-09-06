import { Cv, Esperienza, Formazione } from './cv.interface'; // Assicurati che il percorso sia corretto
export class CvImplementation implements Cv {
  id: number = 0;
  nome: string = '';
  cognome: string = '';
  email: string = '';
  telefono: string = '';
  indirizzo: string = '';
  titolo: string = '';
  esperienze: Esperienza[] = [];
  formazioni: Formazione[] = [];

  static fromDto(dto: Cv): CvImplementation {
    const instance = new CvImplementation();
    instance.id = dto.id;
    instance.cognome = dto.cognome || '';
    instance.nome = dto.nome || '';
    instance.email = dto.email || '';
    instance.telefono = dto.telefono || '';
    instance.indirizzo = dto.indirizzo || '';
    instance.titolo = dto.titolo || '';
    
    // Gestisci casi in cui esperienze e formazioni potrebbero essere undefined o null
    instance.esperienze = Array.isArray(dto.esperienze)
      ? dto.esperienze.map(exp => ({
          nome: exp.nome || '',
          luogo: exp.luogo || '',
          dataInizio: exp.dataInizio ? new Date(exp.dataInizio) : new Date(),
          dataFine: exp.dataFine ? new Date(exp.dataFine) : new Date(),
          descrizione: exp.descrizione || ''
        }))
      : [];
      console.log(instance.esperienze);

    instance.formazioni = Array.isArray(dto.formazioni)
      ? dto.formazioni.map(form => ({
          nome: form.nome || '',
          luogo: form.luogo || '',
          dataInizio: form.dataInizio ? new Date(form.dataInizio) : new Date(),
          dataFine: form.dataFine ? new Date(form.dataFine) : new Date(),
          descrizione: form.descrizione || ''
        }))
      : [];

    return instance;
  }
}

export class EsperienzaImplementation implements Esperienza {
  nome: string = '';
  luogo: string = '';
  dataInizio: Date = new Date();
  dataFine: Date = new Date();
  descrizione: string = '';
}

export class FormazioneImplementation implements Formazione {
  nome: string = '';
  luogo: string = '';
  dataInizio: Date = new Date();
  dataFine: Date = new Date();
  descrizione: string = '';
}

// Funzione per ottenere chiavi uniche da un array di oggetti
export function getUniqueKeys(...instances: object[]): string[] {
  // Usa un Set per rimuovere le chiavi duplicate
  const allKeys = new Set<string>();
  instances.forEach(instance => {
    Object.keys(instance).forEach(key => allKeys.add(key));
  });
  return Array.from(allKeys);
}
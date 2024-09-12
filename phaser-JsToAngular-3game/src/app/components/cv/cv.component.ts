import { Component, OnInit } from "@angular/core";
import { CvService } from "../../service/cv.service";
import {combineLatest,Subscription} from "rxjs";
import { CommonModule } from "@angular/common";
import {  FormsModule, NgForm } from "@angular/forms";
import {  CvImplementation,  EsperienzaImplementation,  FormazioneImplementation,  getUniqueKeys,} from "../../models/cv/cv.model";
import { AuthService } from "./../../auth/auth.service";

@Component({        
  selector: "app-cv",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./cv.component.html",
  styleUrl: "./cv.component.scss",
  /* il principio iniziale é non riscrivere html, uno per blocco*/
  /* a blocchi dinamici quindi dinamico ma non linere (questo rende la lettura un po difficile) ma il codice e riutilizzabile ovunque
  completamente controllato, in basso cé la versione comentata con i validatori ma il rischio di bug e estremamente aumentato
  in qundo lutilizzo dei binding sugli atrributi cambia la logica costantemente al suo cambiamento quindi se si vuole rendere nuovi blocchi
  bisogna modificare tutto il codice in quanto le funzioni non vengono richiamate ma hanno il cambio di stato costante, nel primo caso hai sia il controllo iniziale e poi hai
  i controlli instantanei, nei validatori hai i controlli instantanei ma alla fine il controllo lho fai dopo il submit quindi diventa ridontante
  e complesso*/ 
  /* il sistema fa una conversione delloggetto in quanto il back and non era dacordo con il front nei pensieri di gianluca quindi,
  mi sono complicato la vita ma se il back end avesse rispedito indietro i dati (blocco di arrey e dentro al blocco tantti arrey contenti oggetti in modo da poterli
  direttamente ciclare ed avere il controllo dei for tramite indice quindi era solo una questione di aumenti o decrementi e le combinazioni dii colore da css) */
})/* il sistema e stato concepico per essere estremamente dinamico e bisezionato a blocchi dinamici quindi dinamico non linere, se aggiungo/elimino attributi agli ogetti non ho problmei 
basta cambiare interfaccia e il model dei dto (aggiungere cio che serve per la verifica di typescript) il resto rimane sempre uguale
a meno che si voglia aggiungere unaltra sezione allora bisogna aggiungere un altro array di attributi e un altro array di oggetti
e la sua sezzione
*/
/*  se stai capnedo, la logica segue il tasto save a partire da countAttributepersonal e va avanti sempre 
segui il tasto al click di save, se countAttributePersonal è minore di attributesPersonal.length-1
allora incrementi countAttributePersonal e vai avanti, se countAttributePersonal è uguale a attributesPersonal.length-1
allora vai avanti e passi a esperienza, se countAttributeEsperienza è minore di attributesEsperienza.length-1
allora incrementi countAttributeEsperienza e vai avanti, se countAttributeEsperienza è uguale a attributesEsperienza.length-1
allora vai avanti e passi a formazione, se countAttributeFormazione è minore di attributesFormazione.length-1
allora incrementi countAttributeFormazione e vai avanti, se countAttributeFormazione è uguale a attributesFormazione.length-1
alora hai completato il cv e puoi salvare 
il tastto cancela e add aumentano e decrementano ma non vanno oltre il limite degli array sono contenuti inpediscono lho stakoverflow
e la ridondanza di dati, il tasto cancela elimina l'elemento corrente e se non ci sono elementi elimina tutto e aggiunge un elemento vuoto
(se sono a zero non visualizza nulla si aggiunge un campo vuoto e si visualizza, ed il cambiamento non lho fai all oggetto principale ma allarray di oggetti
in modo che se io cambio vado nel persona o nella formazione nel caso fossi in esperienza non ho un oggetto vuoto da rispedire nel back e ho controlli dimeno da fare
ed la logica diventa piú pulita
)*/
export class CvComponent implements OnInit {
  cvSubscription!: Subscription;
  cv!: CvImplementation;
  acttive: boolean = false;
  userIdSubscription!: Subscription;
  switches = { personal: true, esp: false, form: false,};
  attributes: string[] = [];
  attributesPersonal: { nome: string; value: string }[] = [];
  attributesEsperienza: { nome: string; value: string }[][] = [];
  attributesFormazione: { nome: string; value: string }[][] = [];
  countAttributesPersonal = 0;
  countAttributesEsperienza = 0;
  countAttributesFormazione = -1;
  constructor(private cvSrv: CvService, private auth: AuthService) {}
  ngOnInit(): void {
    this.initializeCv();
  }
  
  private initializeCv(): void {
  this.cvSrv.getCV();
    this.cvSubscription = combineLatest([this.cvSrv.cvUser$,this.auth.userId$,]).subscribe(([cv, userId]) => {
      this.cv = cv ? CvImplementation.fromDto(cv) : new CvImplementation();
      if (userId) {
        this.cv.id = userId;
        this.initializeAttributes();
        this.acttive = true;
      }
    });
  }
  
  private initializeAttributes(): void {
    this.attributesPersonal = this.convertToAttributes(this.cv, ['id', 'esperienze', 'formazioni']);
    this.attributesEsperienza = this.cv.esperienze.map(exp => this.convertToAttributes(exp));
    this.attributesFormazione = this.cv.formazioni.map(form => this.convertToAttributes(form));
  }
  
  private convertToAttributes(obj: any, excludeKeys: string[] = []): { nome: string; value: string }[] {
    return Object.keys(obj)
    .filter(key => !excludeKeys.includes(key))
    .map(key => {
      let value = obj[key];
      if (value instanceof Date) {
        value = value.toISOString().split('T')[0]; // Formatta la data come YYYY-MM-DD
      } else if (value !== null && value !== undefined) {
        value = value.toString();
      } else {
        value = '';
      }
      return { nome: key, value: value };
    });
  }
  onPersonalContact(form: NgForm) {
    if (Object.values(form.value).some((value) => {return value !== "";})) {
      Object.assign(this.cv, form.value);
      if (this.attributesPersonal.length !== this.countAttributesPersonal + 1)
        this.countAttributesPersonal++;
      /* attivo formazione e disattivo personal e inserisco e visualizo i dati */ else {
        this.switches.personal = false;
        this.switches.esp = true;
        if (this.cv.esperienze.length === 0) {
          this.addEsperienza(form);
         /*  this.nextBlock(); */
        }
      }
    }
  }
  cancellaEsperienza() {
    if (this.attributesEsperienza.length > 0) {
      this.cv.esperienze.splice(this.countAttributesEsperienza, 1);
      this.attributesEsperienza.splice(this.countAttributesEsperienza, 1);
      this.countAttributesEsperienza = Math.max(0, this.countAttributesEsperienza - 1);
    }
    if (this.attributesEsperienza.length === 0 &&this.cv.esperienze.length === 0) {
      this.countAttributesEsperienza=0;
      this.addEsperienza();
      /* this.countAttributesEsperienza-- */
    }
  }
  cancellaFormazzione() {
    if (this.attributesFormazione.length > 0) {
      this.cv.esperienze.splice(this.countAttributesFormazione, 1);
      this.attributesFormazione.splice(this.countAttributesFormazione, 1);
      this.countAttributesFormazione = Math.max(0, this.countAttributesFormazione - 1);
    }
    console.log(this.countAttributesFormazione)
    if (this.attributesFormazione.length === 0 &&this.cv.esperienze.length === 0) {
      this.backBlockForm();
    }
  }
  
  
  addEsperienza(form?: NgForm) {
    if (this.attributesEsperienza.length === this.attributesEsperienza.length) {
      const esperienzaArray = this.convertToAttributes(new EsperienzaImplementation());
      this.attributesEsperienza.splice(this.countAttributesEsperienza+1, 0, esperienzaArray);
      if(form?.valid){
        this.onPersonalEsperienza(form);
      }
    }
  }
  addFormazione(form?: NgForm) {
    if (this.attributesFormazione.length === this.attributesFormazione.length) {
      const formazioneArray = this.convertToAttributes(new FormazioneImplementation());
      this.attributesFormazione.splice(this.countAttributesFormazione+1, 0, formazioneArray);
      if(form?.valid){
        this.onPersonalFormazione(form);
      }
    }
  }
  onPersonalEsperienza(form: NgForm) {
    console.log(this.attributesFormazione);
    console.log(this.cv.formazioni);
    if (form.valid) {
      if (this.countAttributesEsperienza > this.cv.esperienze.length - 1) {
        this.cv.esperienze.push(new EsperienzaImplementation());
      }
      Object.assign(this.cv.esperienze[this.countAttributesEsperienza], form.value);
      if (this.attributesFormazione.length === 0) {
        console.log('add');
        this.addFormazione();
         /* this.backBlockForm(); */
      }else
      this.nextBlock();
      console.log(this.countAttributesEsperienza);
    }
  }
  onPersonalFormazione(form: NgForm) {
    if(form.valid){
      if(this.countAttributesFormazione>this.cv.formazioni.length-1){
        this.cv.formazioni.push(new FormazioneImplementation());
      }
      Object.assign(this.cv.formazioni[this.countAttributesFormazione],form.value);
      this.nextBlock();
    }
  }
  
  nextBlock() {
    if (this.countAttributesEsperienza < this.attributesEsperienza.length - 1) {
      this.countAttributesEsperienza++;
    } else if (this.countAttributesFormazione < this.attributesFormazione.length - 1) {      
      this.switches.esp = false;
      this.switches.form = true;
      this.countAttributesFormazione++;
    }
    console.log(this.attributesEsperienza);
    console.log(this.attributesFormazione);
    console.log(this.attributesFormazione);
    
  }
  backBlockEsp() {
    if(this.countAttributesEsperienza===0){
      this.countAttributesPersonal=0;
      this.switches.personal=true;
      this.switches.esp=false;
    }else {
      this.countAttributesEsperienza = Math.max(0, this.countAttributesEsperienza - 1);
    }
  }
  backBlockForm() {
    if(this.countAttributesFormazione===0){
      this.countAttributesFormazione=-1;
      this.switches.form=false;
      this.switches.esp=true;
    }else {
      this.countAttributesFormazione = Math.max(0, this.countAttributesFormazione - 1);
    }
  }
  ngOnDestroy(): void {
    if (this.cvSubscription) {
      this.cvSubscription.unsubscribe();
    }
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }
}
  
  //metodo 2 col form normale nella seconda parte e dinamico nella prima senza del form (non intuitivo)
  // this.cvSrv.getCV();
  /*     this.cvSubscription = this.cvSrv.cvUser$.subscribe((cv) => {
    this.cv = CvImplementation.fromDto(cv);
    this.userIdSubscription = this.auth.userId$.subscribe((userId) => {
      if (userId !== null) {
        this.cv.id = userId;
        console.log(this.cv.esperienze);
        this.cv.esperienze.forEach((element) => {
            Object.keys(element).forEach((key) => {
              this.attributesFormazione.push({ nome: key, value: element[key as keyof Esperienza].toString() });
            });
          });
        }
      });
      //  console.log(this.cv);
    });
    this.attributes=getUniqueKeys(this.cv).filter(
      (key) => key !== "id" );
      //this.attributesFormazione=getUniqueKeys(this.esperienzaInstance);
      console.log(this.attributesFormazione);
    //  console.log(this.cv);
    }
  get currentAttribute() { 
    // console.log(this.attributes[this.currentAttributeIndex]);
      return this.attributes[this.currentAttributeIndex];
   } 
   get cvText(): string {
 //   console.log(this.cv);
    const attributeName = this.attributes[this.currentAttributeIndex] as keyof CvImplementation;
    const value = this.cv[attributeName];
    this.isInputEmpty = value === '';
    return typeof value === 'string' ? value : ''; // Restituisce una stringa vuota se il valore non è una stringa
  }

  set cvText(value: string) {
  //  console.log(value);
    const attributeName = this.attributes[this.currentAttributeIndex] as keyof CvImplementation;
    (this.cv[attributeName] as string) = value;
    this.isInputEmpty = value.trim() === '';
  }
 nextAttribute(){
   const attributeName = this.attributes[this.currentAttributeIndex] as keyof CvImplementation;
   //console.log(this.attributes);
   if(this.cv[attributeName] as string!==''){
    // this.currentAttributeIndex = (this.currentAttributeIndex + 1) % this.attributes.length;
    if(this.attributes[this.currentAttributeIndex+1]==='esperienze')
      this.formazione();
    else if(this.attributes.length>this.currentAttributeIndex + 1)
      this.currentAttributeIndex++;
    }
  //  console.log(this.cv);
}
formazione(){
  this.switches.form=true;
  this.switches.personal=false;
  //console.log('formazione')
 
  console.log(this.attributesFormazione);
}


onPersonalContact(form: NgForm) {
  // Gestisci l'evento di submit qui
  console.log(form.value);
  console.log(this.cv);
}
  ngOnDestroy(): void {
    if (this.cvSubscription) {
      this.cvSubscription.unsubscribe();
    }
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  } */

  /*//inserimento con validatori
   ngOnInit(): void {
    this.personalContact = this.fb.group({
      id: [0],
      nome: ["", Validators.required],
      cognome: ["", Validators.required],
      email: ["", Validators.required],
      telefono: ["", Validators.required],
      indirizzo: ["", Validators.required],
      titolo: ["", Validators.required],
      esperienze: this.fb.array([]),
      formazioni: this.fb.array([]),
      currentAttribute: ["", Validators.required], // Aggiungi un controllo di default
    });
    this.cvSrv.getCV();
    
    this.cvSubscription = this.cvSrv.cvUser$.subscribe((cv) => {
      this.cv = cv;
      console.log(this.cv);
      this.attributes = this.getObjectKeys(this.cv).filter(
        (key) => key !== "esperienze" && key !== "formazioni" && key !== "id"
      );

      //this.personalContact = this.fb.group({});

      // Dynamically add controls for each attribute
      this.attributes.forEach((attr) => {
        console.log(attr);
        this.personalContact.addControl(attr, this.fb.control(this.cv[attr] || "", Validators.required));
      });
      this.setCurrentAttributeControl();
    });
    
  }
  private setCurrentAttributeControl() {
    const currentAttr = this.currentAttribute;
    console.log(currentAttr);
    if (!this.personalContact.get(currentAttr)) {
      this.personalContact.addControl(currentAttr, this.fb.control(this.cv[currentAttr] || "", Validators.required));
    }
  }
  onPersonalContact() {
    if (this.personalContact.valid) {
      console.log(this.personalContact.value);
    }else
    {
      console.log(this.personalContact.value);
    }
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  nextAttribute() {
    this.currentAttributeIndex =
      (this.currentAttributeIndex + 1) % this.attributes.length;
  }

  get currentAttribute() {
    return this.attributes[this.currentAttributeIndex];
  }

  get currentAttributeValue() {
    return this.cv ? this.cv[this.currentAttribute] : "";
  } */

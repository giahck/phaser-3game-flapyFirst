import { Component, OnInit } from "@angular/core";
import { CvService } from "../../service/cv.service";
import { Cv } from "../../models/cv/cv.interface";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import {
  Form,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-cv",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./cv.component.html",
  styleUrl: "./cv.component.scss",
})
export class CvComponent implements OnInit {
  cvSubscription!: Subscription;
  cv!: Cv;
  personalContact!: FormGroup;
  currentAttributeIndex: number = 0;
  attributes: string[] = [];
  constructor(private cvSrv: CvService, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.cvSrv.getCV();
    this.personalContact = this.fb.group({
      /* id: [0], */
      nome: ["", Validators.required],
      cognome: ["", Validators.required],
      email: ["", Validators.required],
      telefono: ["", Validators.required],
      indirizzo: ["", Validators.required],
      titolo: ["", Validators.required],
/*       esperienze: this.fb.array([]),
      formazioni: this.fb.array([]), */
    });
    this.cvSubscription = this.cvSrv.cvUser$.subscribe((cv) => {
      if (cv) {
        /*  this.cv = cv;
        this.personalContact.patchValue(cv);
      }else {  */
        this.cv = this.personalContact.value as Cv;
        console.log(this.cv);
        console.log(this.personalContact.value);
      }
    });
    this.attributes=Object.keys(this.personalContact.controls).filter(
      (key) => key !== "esperienze" && key !== "formazioni" && key !== "id" && key !== "id" );
    console.log(this.attributes);
    this.attributes.forEach(attr => {
      if (!this.personalContact.get(attr)) {
        this.personalContact.addControl(attr, this.fb.control('', Validators.required));
      }
    });
  }
  onPersonalContact() {
    if (this.personalContact.valid) {
      console.log(this.personalContact.value);
    } else {
      console.log(this.personalContact.value);
    }
  }
  nextAttribute(){
    const currentControl = this.personalContact.get(this.currentAttribute);
  
    // Verifica il valore del controllo corrente prima di passare al successivo
    console.log(`Valore di ${this.currentAttribute}:`, currentControl?.value);

    this.currentAttributeIndex = (this.currentAttributeIndex + 1) % this.attributes.length;
    const nextControl = this.personalContact.get(this.currentAttribute);
    console.log(`Prossimo attributo: ${this.currentAttribute}, valore:`, nextControl?.value);
  }
  get currentAttribute() {
   // console.log(this.attributes[this.currentAttributeIndex]);
    return this.attributes[this.currentAttributeIndex];
  }
  get valore() {
   // console.log(this.personalContact.get(this.currentAttribute)?.value);
    return this.cv[this.currentAttribute]
  }
 


  /* ngOnInit(): void {
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

}

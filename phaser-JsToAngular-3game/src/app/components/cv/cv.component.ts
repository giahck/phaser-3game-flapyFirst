import { Component, OnInit } from '@angular/core';
import { CvService } from '../../service/cv.service';
import { Cv } from '../../models/cv/cv.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss'
})
export class CvComponent implements OnInit {
  cvSubscription!: Subscription;
  cv:Cv[]=[];
constructor(private cvSrv:CvService) { }
  ngOnInit(): void {
    this.cvSrv.getCV();
    this.cvSubscription=this.cvSrv.cvUser$.subscribe(
      (cv)=>{
        this.cv=cv;
        console.log(this.cv);
      }
    );
  }

}

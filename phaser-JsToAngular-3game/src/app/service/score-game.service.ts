import { Token } from './../models/registrazione/auth-data';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Score } from '../models/gameScore/score.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreGameService {
  apiUrl=environment.apiURL;
private scoreB=new BehaviorSubject<Score>({} as Score);
score$=this.scoreB.asObservable();
  constructor(private http:HttpClient,private idAuht:AuthService) { }



  getScore(){
    const userId = this.idAuht.getId;
    if (!userId) {
      console.error('User ID is null');
      return;
    }
   if(this.idAuht.getId){
     // console.log(this.idAuht.getId);
        this.http.get<{ id: number; score: number }>(`${this.apiUrl}score/${userId}`).subscribe((data)=>{
          
          const scor:Score={
            flappy:data
          };
          if(!data){
            console.log('data null');
            scor.flappy={id:userId,score:0};
          }
          this.scoreB.next(scor);
        }); 
  }
}
  scoreSingoleGame(score:Score){
    console.log(score);
    const token = localStorage.getItem('jwToken') || sessionStorage.getItem('jwToken');
    if (!token) {
      console.error('Token is null');
      return;
    }
    fetch(`${this.apiUrl}score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(score)
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Score not saved');
      }
    }).then((responseData) => {
      console.log('Score saved:', responseData);
    }).catch((error) => {
      console.error(error);
    });
  }


}

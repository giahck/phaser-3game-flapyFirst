export interface AuthData {
    id: number;
    cognome: string;
    nome: string;
    email: string;
    enabled: boolean;
    rememberMe: boolean;
    accessToken: string;
    ruolo: string;
}
export class Token {
    constructor(  public idToken: string,    
      public accessToken: string) {}
  }
  export class MessageDto {
    constructor(public message: string) {}
  }
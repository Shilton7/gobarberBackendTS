// Mudança de definição de tipos no plugin express, adicionando um tipo user no Request para acesso global após login

declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}

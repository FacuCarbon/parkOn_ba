export type User = {
  id: string;
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  patente: string;
  vehiculo: string;
};

export type UserInput = Omit<User, "id">;

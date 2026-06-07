import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import seedUsers from "../data/users.json";
import type { User, UserInput } from "../types/user";

type LoginResult = { ok: true } | { ok: false; error: string };

type UserContextValue = {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => LoginResult;
  register: (data: UserInput) => LoginResult;
  updateCurrentUser: (data: UserInput) => LoginResult;
  logout: () => void;
};

const USERS_STORAGE_KEY = "parkonba.users";
const SESSION_STORAGE_KEY = "parkonba.currentUserId";

const UserContext = createContext<UserContextValue | undefined>(undefined);

function readStoredUsers(): User[] {
  const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }

  try {
    return JSON.parse(storedUsers) as User[];
  } catch {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function persistUsers(users: User[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => readStoredUsers());
  const [currentUserId, setCurrentUserId] = useState<string | null>(() =>
    window.localStorage.getItem(SESSION_STORAGE_KEY),
  );

  const currentUser =
    users.find((user) => user.id === currentUserId) ?? null;

  const value = useMemo<UserContextValue>(
    () => ({
      currentUser,
      users,
      login(email, password) {
        const user = users.find(
          (item) =>
            normalizeEmail(item.email) === normalizeEmail(email) &&
            item.password === password,
        );

        if (!user) {
          return { ok: false, error: "Email o contrasena incorrectos." };
        }

        window.localStorage.setItem(SESSION_STORAGE_KEY, user.id);
        setCurrentUserId(user.id);
        return { ok: true };
      },
      register(data) {
        const email = normalizeEmail(data.email);
        const exists = users.some(
          (item) => normalizeEmail(item.email) === email,
        );

        if (exists) {
          return { ok: false, error: "Ya existe una cuenta con ese email." };
        }

        const nextUser: User = {
          ...data,
          email,
          patente: data.patente.trim().toUpperCase(),
          id: `usr-${Date.now()}`,
        };
        const nextUsers = [...users, nextUser];

        persistUsers(nextUsers);
        setUsers(nextUsers);
        window.localStorage.setItem(SESSION_STORAGE_KEY, nextUser.id);
        setCurrentUserId(nextUser.id);
        return { ok: true };
      },
      updateCurrentUser(data) {
        if (!currentUser) {
          return { ok: false, error: "No hay una sesion activa." };
        }

        const email = normalizeEmail(data.email);
        const exists = users.some(
          (item) =>
            item.id !== currentUser.id && normalizeEmail(item.email) === email,
        );

        if (exists) {
          return { ok: false, error: "Ese email ya esta en uso." };
        }

        const nextUsers = users.map((user) =>
          user.id === currentUser.id
            ? {
                ...user,
                ...data,
                email,
                patente: data.patente.trim().toUpperCase(),
              }
            : user,
        );

        persistUsers(nextUsers);
        setUsers(nextUsers);
        return { ok: true };
      },
      logout() {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
        setCurrentUserId(null);
      },
    }),
    [currentUser, users],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider.");
  }

  return context;
}

export interface StoredUser {
  name: string;
  admissionNo: string;
  password: string;
}

export interface SessionUser {
  name: string;
  admissionNo: string;
}

const USERS_KEY = 'campusbites_users';
const SESSION_KEY = 'campusbites_session';

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (u): u is StoredUser =>
        typeof u === 'object' &&
        u !== null &&
        typeof (u as StoredUser).name === 'string' &&
        typeof (u as StoredUser).admissionNo === 'string' &&
        typeof (u as StoredUser).password === 'string'
    );
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as SessionUser;
    if (typeof u?.name !== 'string' || typeof u?.admissionNo !== 'string') return null;
    return { name: u.name, admissionNo: u.admissionNo };
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function registerUser(name: string, admissionNo: string, password: string): { ok: true } | { ok: false; error: string } {
  const trimmedName = name.trim();
  const trimmedAdm = admissionNo.trim();
  if (!trimmedName || !trimmedAdm || !password) {
    return { ok: false, error: 'Please fill in all fields.' };
  }
  const users = loadUsers();
  if (users.some(u => u.admissionNo === trimmedAdm)) {
    return { ok: false, error: 'This admission number is already registered.' };
  }
  users.push({ name: trimmedName, admissionNo: trimmedAdm, password });
  saveUsers(users);
  return { ok: true };
}

export function verifyLogin(admissionNo: string, password: string): { ok: true; user: SessionUser } | { ok: false; error: string } {
  const trimmedAdm = admissionNo.trim();
  if (!trimmedAdm || !password) {
    return { ok: false, error: 'Admission number and password are required.' };
  }
  const users = loadUsers();
  const found = users.find(u => u.admissionNo === trimmedAdm);
  if (!found || found.password !== password) {
    return { ok: false, error: 'Invalid admission number or password.' };
  }
  return { ok: true, user: { name: found.name, admissionNo: found.admissionNo } };
}

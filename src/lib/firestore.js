import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const QUESTIONS_PATH = 'questions';
const SESSION_PATH = 'session/live';

export function listenToQuestions(callback) {
  return onSnapshot(query(collection(db, QUESTIONS_PATH), orderBy('order', 'asc')), (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function saveQuestion(id, payload) {
  await setDoc(doc(db, QUESTIONS_PATH, id), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export function listenToSession(callback) {
  return onSnapshot(doc(db, SESSION_PATH), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null);
  });
}

export async function startSession(initial = 0, duration = 120) {
  await setDoc(doc(db, SESSION_PATH), {
    currentIndex: initial,
    duration,
    startedAt: Date.now(),
    running: true,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function advanceSession(nextIndex, duration) {
  await updateDoc(doc(db, SESSION_PATH), {
    currentIndex: nextIndex,
    duration,
    startedAt: Date.now(),
    running: true,
    updatedAt: serverTimestamp(),
  });
}

export async function submitResponse(questionId, answer, playerName = 'anonymous') {
  const id = `${questionId}_${playerName.replace(/\s+/g, '_').toLowerCase()}`;
  await setDoc(doc(db, 'responses', id), {
    questionId,
    playerName,
    answer,
    submittedAt: serverTimestamp(),
  });
}

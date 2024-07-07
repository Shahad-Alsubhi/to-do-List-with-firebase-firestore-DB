import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
  updateDoc,getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { app } from "./firebaseConfig.js";

const db = getFirestore(app);

let tasksTable = collection(db, "tasks");

export async function storeTask(task) {
  let newTask = {
    id: task.id,
    title: task.taskText,
    completed: task.completed,
  };
  let docRef = await addDoc(tasksTable, newTask);
  await updateDoc(doc(db, "tasks", docRef.id), { id: docRef.id });
}

export async function fetchAllTasks() {
  const querySnapshot = await getDocs(tasksTable);
  const tasks = [];
  querySnapshot.forEach((doc) => {
    const taskData = doc.data();
    tasks.push({
      id: taskData.id,
      taskText: taskData.title,
      completed: taskData.completed,
    });
  });
  return tasks;
}

export async function deleteAllTasks() {
  const querySnapshot = await getDocs(tasksTable);
  const batch = writeBatch(db);

  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}

export async function selectAllTasks() {
  const querySnapshot = await getDocs(tasksTable);
  const batch = writeBatch(db);

  querySnapshot.forEach((docSnapshot) => {
    const taskRef = doc(db, "tasks", docSnapshot.id);
    batch.update(taskRef, { completed: true });
  });

  await batch.commit();
}

export async function deleteTaskById(taskId) {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
}

export async function checkTaskById(taskId) {
  const taskRef = doc(db, "tasks", taskId);
  const taskSnap = await getDoc(taskRef);

  const taskData = taskSnap.data();

  await updateDoc(taskRef, { completed: !taskData.completed });
}

export async function editTask(taskId, newTitle) {
  const taskRef = doc(db, "tasks", taskId);

  await updateDoc(taskRef, { title: `${newTitle}` });
}

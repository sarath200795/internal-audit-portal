import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  where,
} from 'firebase/firestore'
import {
  updateProfile as updateAuthProfile,
  updatePassword,
} from 'firebase/auth'
import { auth, db } from '../lib/firebase'

/**
 * Subscribe to all users within an organization (admin view).
 */
export function subscribeOrgUsers(orgId, callback) {
  const q = query(
    collection(db, 'users'),
    where('orgId', '==', orgId),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export function approveUser(uid) {
  return updateDoc(doc(db, 'users', uid), { status: 'approved' })
}

export function rejectUser(uid) {
  return updateDoc(doc(db, 'users', uid), { status: 'rejected' })
}

export function setUserRole(uid, role) {
  return updateDoc(doc(db, 'users', uid), { role })
}

export function updateOwnName(uid, name) {
  const tasks = [updateDoc(doc(db, 'users', uid), { name })]
  if (auth.currentUser) {
    tasks.push(updateAuthProfile(auth.currentUser, { displayName: name }))
  }
  return Promise.all(tasks)
}

export function changeOwnPassword(newPassword) {
  return updatePassword(auth.currentUser, newPassword)
}

import { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase"
import { resumeData as defaultData } from "../data/resume"
import type { ResumeData } from "../data/resume"

const RESUME_DOC = "resume/main"

export function useResume() {
  const [data, setData] = useState<ResumeData>(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResume()
  }, [])

  async function loadResume() {
    try {
      const snap = await getDoc(doc(db, RESUME_DOC))
      if (snap.exists()) {
        setData({ ...defaultData, ...snap.data() } as ResumeData)
      } else {
        // First time: upload default data to Firestore
        await setDoc(doc(db, RESUME_DOC), defaultData)
      }
    } catch (err) {
      console.error("Failed to load resume from Firestore:", err)
      // Fallback to local data
    }
    setLoading(false)
  }

  async function saveResume(newData: ResumeData) {
    setData(newData)
    try {
      await setDoc(doc(db, RESUME_DOC), newData)
    } catch (err) {
      console.error("Failed to save resume:", err)
      throw err
    }
  }

  return { data, loading, saveResume }
}

import { applySnapshot, onSnapshot } from "mobx-state-tree"
import { load, save } from "@/utils/storage/storage"
import { ChatStoreModel, ChatStoreSnapshotIn } from "./ChatStore"

const STORAGE_KEY = "chatStoreSnapshot"

function loadInitialState(): ChatStoreSnapshotIn | undefined {
  try {
    const data = load<ChatStoreSnapshotIn>(STORAGE_KEY)
    return data ?? undefined
  } catch {
    return undefined
  }
}

function createStore() {
  const initialState = loadInitialState()
  const store = ChatStoreModel.create(initialState ?? { threads: {} })

  // persist on every change
  onSnapshot(store, (snap) => {
    save(STORAGE_KEY, snap)
  })

  return store
}

export const rootStore = createStore()

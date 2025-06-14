import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * A RootStore model.
 */
import { ChatStoreModel } from "./ChatStore"
import { AuthStoreModel } from "./AuthStore"

export const RootStoreModel = types.model("RootStore").props({
  chatStore: types.optional(ChatStoreModel, {} as any),
  authStore: types.optional(AuthStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

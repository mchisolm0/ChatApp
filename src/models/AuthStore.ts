import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * AuthStore handles authentication form state and login action.
 * It does not directly depend on React hooks; instead, the component should
 * supply the Clerk methods and router when invoking `signIn`.
 */
export const AuthStoreModel = types
  .model("AuthStore", {
    emailAddress: types.optional(types.string, ""),
    username: types.optional(types.string, ""),
    password: types.optional(types.string, ""),
    isLoading: types.optional(types.boolean, false),
    error: types.maybe(types.string),
    pendingVerification: types.optional(types.boolean, false),
    code: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    /**
     * Helper setters for convenience – keeps components clean & type-safe.
     */
    setEmail(email: string) {
      self.emailAddress = email
    },
    setUsername(username: string) {
      self.username = username
    },
    setPassword(pw: string) {
      self.password = pw
    },
    setCode(code: string) {
      self.code = code
    },
    setUserData(email: string, username: string) {
      self.emailAddress = email
      self.username = username
    },
  }))

export interface AuthStore extends Instance<typeof AuthStoreModel> {}
export interface AuthStoreSnapshotIn extends SnapshotIn<typeof AuthStoreModel> {}
export interface AuthStoreSnapshotOut extends SnapshotOut<typeof AuthStoreModel> {}

import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * AuthStore handles authentication form state and login action.
 * It does not directly depend on React hooks; instead, the component should
 * supply the Clerk methods and router when invoking `signIn`.
 */
export const AuthStoreModel = types
  .model("AuthStore", {
    // High-level auth state returned by `useConvexAuth()`
    isAuthenticated: types.optional(types.boolean, false),
    isLoading: types.optional(types.boolean, true),

    // Extra user info (filled by a user query once logged in)
    userId: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    fullName: types.maybeNull(types.string),
    avatarUrl: types.maybeNull(types.string),

    error: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    /** Handy computed flag so components don’t repeat the long check. */
    get isLoggedIn() {
      return self.isAuthenticated && !!self.userId;
    },
  }))
  .actions((self) => ({
    /**
     * Synchronise the store with values from `useConvexAuth()` and any user-details query.
     */
    updateAuthState(args: {
      isAuthenticated: boolean;
      isLoading: boolean;
      userId?: string | null;
      email?: string | null;
      fullName?: string | null;
      avatarUrl?: string | null;
      error?: string | null;
    }) {
      self.isAuthenticated = args.isAuthenticated;
      self.isLoading = args.isLoading;
      self.userId = args.userId ?? null;
      self.email = args.email ?? null;
      self.fullName = args.fullName ?? null;
      self.avatarUrl = args.avatarUrl ?? null;
      self.error = args.error ?? undefined;
    },
  }))

export interface AuthStore extends Instance<typeof AuthStoreModel> { }
export interface AuthStoreSnapshotIn extends SnapshotIn<typeof AuthStoreModel> { }
export interface AuthStoreSnapshotOut extends SnapshotOut<typeof AuthStoreModel> { }
// import { useMobX } from '@utils/next'
import { User } from "@firebase/auth";
import { FirebaseUser } from "@gazebo/firebase";
import { action, computed, makeObservable, observable } from "mobx";
import { auth } from "../firebase/core";
import { logger } from "../utils";

const log = logger("ProfileStore");

export default class FirestoreProfileStore {
  public firebaseProfile: FirebaseUser | null;
  public loading: boolean;

  constructor() {
    this.firebaseProfile = null;
    this.loading = true;

    if (typeof window !== "undefined") {
      auth.onAuthStateChanged(action((user: User | null) => {
        log("authStateChanged:", user);
        this.firebaseProfile = user;
        this.loading = false;
      }));
    }

    makeObservable(this, {
      firebaseProfile: observable,
      loading: observable,
      isLoggedIn: computed,
      userID: computed,
    });
  }

  public hydrate() { }

  get isLoggedIn() {
    return !!this.firebaseProfile;
  }

  get userID(): string | null {
    return this.firebaseProfile?.uid || null;
  }
}

export const PROFILE_STORE = new FirestoreProfileStore();

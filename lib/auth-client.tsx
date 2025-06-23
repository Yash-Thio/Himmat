"use client";

import { useRouter } from "next/navigation";
import { ProgressLoader } from "nextjs-progressloader";
import { Dispatch, PropsWithChildren, SetStateAction, useEffect } from "react";
import React, {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useState,
} from "react";

import { GetCurrentUserQuery } from "@/__generated__/graphql";

type CurrentUser = GetCurrentUserQuery["user"];

const GlobalState = createContext<{
  token?: string | null;
  setToken: Dispatch<SetStateAction<string | null | undefined>>;
  user?: CurrentUser;
  setUser: Dispatch<SetStateAction<CurrentUser>>;
  isSosActive: boolean;
  setIsSosActive: Dispatch<SetStateAction<boolean>>;
}>({
  setToken: () => null,
  setUser: () => null,
  isSosActive: false,
  setIsSosActive: () => null,
});

export function useUser() {
  const { user, setUser } = useContext(GlobalState);
  return [user, setUser] as const;
}

export function useToken() {
  const { token } = useContext(GlobalState);
  return token;
}
export function useSetToken() {
  const { setToken } = useContext(GlobalState);
  return setToken;
}

export function useSos() {
  const { isSosActive, setIsSosActive } = useContext(GlobalState);
  return [isSosActive, setIsSosActive] as const;
}

export function GlobalStateWrapper({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>();
  const [user, setUser] = useState<CurrentUser>();
  const [isSosActive, setIsSosActive] = useState(false);

  useEffect(() => {
    const sosActive = localStorage.getItem("sos_active");
    if (sosActive === "true") {
      setIsSosActive(true);
    }
  }, []);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // eslint-disable-next-line -- Message for public
      console.info(
        "BRO PLEASE DON'T TRY TO HACK. I AM BUILDING THIS ALONE, I AM NOT A BIG TECH COMPANY, JUST A SOLO DEVELOPER LIKE YOU, I AM MIGHT HAVE LEFT SOME LOOPHOLES. BE A GOOD HUMAN. I AM TRYING TO SAVE FOR MASTERS IN USA JUST LEAVE ME ALONE BRO I AM JUST 21 WTF IS WRONG WITH YOU.",
      );
    }
  }, []);
  return (
    <GlobalState.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isSosActive,
        setIsSosActive,
      }}
    >
      <Suspense>
        <ProgressLoader color="#5b9364" showSpinner={false} />
      </Suspense>
      {children}
    </GlobalState.Provider>
  );
}

export function useSignUpWithEmail() {
  const { setToken } = useContext(GlobalState);
  return useCallback(
    async (email: string, password: string, name: string) => {
      const res = await fetch(`/api/email`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          name,
        }),
        credentials: "include",
      });
      if (res.ok) {
        setToken(await res.text());
        return null;
      }
      return res.text();
    },
    [setToken],
  );
}
export function useLoginWithEmail() {
  const { setToken } = useContext(GlobalState);
  return useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`/api/email`, {
        method: "PUT",
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });
      if (res.ok) {
        setToken(await res.text());
        return null;
      }
      return res.text();
    },
    [setToken],
  );
}
export function useLogout() {
  const { setToken } = useContext(GlobalState);
  const [, setUser] = useUser();
  const router = useRouter();
  return useCallback(async () => {
    const res = await fetch(`/api/email`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setUser(null);
      setToken(undefined);
      router.push("/");
    }
  }, [setToken, setUser, router]);
}

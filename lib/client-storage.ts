"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { UserVotesState } from "@/lib/types";

const USER_VOTES_EVENT = "werkrecht-user-votes-updated";

function subscribeStorageEvent(eventName: string) {
  return (callback: () => void) => {
    window.addEventListener("storage", callback);
    window.addEventListener(eventName, callback);
    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener(eventName, callback);
    };
  };
}

/**
 * SSR-safe reader for a single string key stored in localStorage.
 */
export function useLocalStorageValue(
  key: string,
  eventName: string,
  defaultValue = ""
): string {
  return useSyncExternalStore(
    subscribeStorageEvent(eventName),
    () => {
      try {
        return window.localStorage.getItem(key) ?? defaultValue;
      } catch {
        return defaultValue;
      }
    },
    () => defaultValue
  );
}

/**
 * SSR-safe reader for a JSON string array stored in localStorage.
 */
export function useLocalStorageList(key: string, eventName: string): string[] {
  const raw = useLocalStorageValue(key, eventName, "[]");
  return useMemo(() => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }, [raw]);
}

export function writeLocalStorageValue(
  key: string,
  value: string,
  eventName: string
): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota / privacy mode errors
  }
  window.dispatchEvent(new Event(eventName));
}

export function writeLocalStorageList(
  key: string,
  values: string[],
  eventName: string
): void {
  writeLocalStorageValue(key, JSON.stringify(values), eventName);
}

/**
 * Keeps per-visitor cookie vote state synchronized across mounted sections.
 */
export function useSyncedUserVotes(
  initialUserVotes: UserVotesState
): [UserVotesState, (next: UserVotesState) => void] {
  const [clientUserVotes, setClientUserVotes] =
    useState<UserVotesState | null>(null);

  useEffect(() => {
    function onUserVotesUpdated(e: Event) {
      const custom = e as CustomEvent<UserVotesState>;
      if (custom.detail) {
        setClientUserVotes(custom.detail);
      }
    }
    window.addEventListener(USER_VOTES_EVENT, onUserVotesUpdated);
    return () => {
      window.removeEventListener(USER_VOTES_EVENT, onUserVotesUpdated);
    };
  }, []);

  function updateUserVotes(next: UserVotesState) {
    setClientUserVotes(next);
    window.dispatchEvent(new CustomEvent(USER_VOTES_EVENT, { detail: next }));
  }

  return [clientUserVotes ?? initialUserVotes, updateUserVotes];
}

export function mergeUniqueIds(
  serverIds: readonly string[],
  localIds: readonly string[]
): string[] {
  return Array.from(new Set([...serverIds, ...localIds]));
}

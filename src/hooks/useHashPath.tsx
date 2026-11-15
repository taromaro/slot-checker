import { useSyncExternalStore } from "react";

// URL のハッシュ（#/kabaneri）を画面の切り替えに使う。
// GitHub Pages はサーバー側でルーティングできないため、ハッシュ方式にしている。
// ブラウザの「戻る」でホームに戻れ、リロードしても同じ画面が開く。

const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

// "#/kabaneri" や "#kabaneri" → "kabaneri"
const getHashPath = () => window.location.hash.replace(/^#\/?/, "");

export const useHashPath = () => useSyncExternalStore(subscribe, getHashPath);

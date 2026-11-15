import { MachineSelect } from "./components/MachineSelect";
import { useHashPath } from "./hooks/useHashPath";
import { MACHINES } from "./machines";

const App = () => {
  const path = useHashPath();
  // 該当する機種が無いとき（ハッシュ無し・不明な ID）はホーム画面
  const machine = MACHINES.find((m) => m.id === path);

  return (
    <main className="mx-auto max-w-xl space-y-3 p-3">
      {machine ? (
        <>
          <a href="#/" className="inline-block text-sm text-blue-700 hover:underline">
            ← 機種選択へ戻る
          </a>
          <machine.Page />
        </>
      ) : (
        <MachineSelect machines={MACHINES} />
      )}
    </main>
  );
};

export default App;

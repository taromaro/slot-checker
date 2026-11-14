import { ChancemeCount } from "./components/ChancemeCount";
import { GedanBell } from "./components/GedanBell";
import { Period } from "./components/Period";

const App = () => {
  return (
    <main className="mx-auto max-w-xl space-y-3 p-3">
      <h1 className="text-xl font-bold">カバネリ</h1>
      <ChancemeCount name="無名" color="red" />
      <ChancemeCount name="生駒" color="green" />
      <Period />
      <GedanBell />
    </main>
  );
};

export default App;

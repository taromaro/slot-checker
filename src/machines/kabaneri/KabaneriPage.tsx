import { ChancemeCount } from "./ChancemeCount";
import { GedanBell } from "./GedanBell";
import { Period } from "./Period";

export const KabaneriPage = () => {
  return (
    <>
      <h1 className="text-xl font-bold">カバネリ</h1>
      <ChancemeCount name="無名" color="red" />
      <ChancemeCount name="生駒" color="green" />
      <Period />
      <GedanBell />
    </>
  );
};

import type { Machine } from "../machines";

type MachineSelectProps = {
  machines: Machine[];
};

export const MachineSelect = ({ machines }: MachineSelectProps) => {
  return (
    <>
      <h1 className="text-xl font-bold">機種選択</h1>
      <ul className="space-y-2">
        {machines.map((machine) => (
          <li key={machine.id}>
            <a
              href={`#/${machine.id}`}
              className="block rounded-xl border border-gray-300 bg-white p-4 text-lg font-bold select-none hover:bg-gray-100 active:bg-gray-200"
            >
              {machine.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

import { useState } from "react";
import { Field, FIELD_BG, FIELDS, OMENS } from "./questTables";

export const QuestTable = () => {
  const [field, setField] = useState<Field>("大社跡");
  return (
    <div>
      <h1>クエストテーブル</h1>
      <div className="flex">
      {FIELDS.map((item) => (
        <label
          className={`border px-4 py-2 rounded cursor-pointer  has-checked:border-red-500 has-checked:border-4 ${FIELD_BG[item]}`}
        >
          <input 
            checked={item == field} type="radio" name="field" onChange={() => setField(item)}
          />
          {item}
        </label>
      ))}
      </div>
      <div className="flex">
        {OMENS.map((item) =>(
          <button 
            className="border px-4 py-2 rounded cursor-pointer transition-colors duration-200 active:bg-yellow-300"
          >{item}</button>
        ))}
      </div>
    </div>
  );
};

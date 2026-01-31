import { Icons } from "../Icons";
import type { BaseInputProps } from "./types";


export default function Toggle({ id, name, className, disabled, onChange }: BaseInputProps) {
  return (
    <div className={className}>
      <label htmlFor={id ?? name} className="relative block h-8 w-14 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:transparent] has-checked:bg-green-500 dark:bg-gray-600 dark:has-checked:bg-green-600">
        <input type="checkbox" id={id ?? name} name={name} className="peer sr-only" disabled={disabled} onChange={onChange} />
        <span className="absolute inset-y-0 start-0 m-1 grid size-6 place-content-center rounded-full bg-white text-gray-700 transition-[inset-inline-start] peer-checked:start-6 peer-checked:*:first:hidden *:last:hidden peer-checked:*:last:block dark:bg-gray-900 dark:text-gray-200">
          {Icons.close}
          {Icons.success}
        </span>
      </label>
    </div>
  );
}

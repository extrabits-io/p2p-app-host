import { capitalize } from "../../helpers/string-utils";
import type { BaseInputProps } from "./types";

type TextInputProps = BaseInputProps & { type?: string; placeholder?: string };

function TextInput(props: TextInputProps) {
  const { id, name, value, onChange, type, placeholder, className } = props;
  return (
    <div className={className}>
      <label
        htmlFor={id ?? name}
        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      >
        <input
          type={type ?? "text"}
          autoComplete={type ?? "text"}
          id={id ?? name}
          name={name}
          className="w-full peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 p-2"
          placeholder={placeholder}
          defaultValue={value}
          onChange={onChange}
        />
        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white dark:bg-black p-0.5 text-xs text-gray-700 dark:text-gray-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          {placeholder ?? capitalize(name)}
        </span>
      </label>
    </div>
  );
}

export default TextInput;

import type { JSX } from "react";

type ButtonProps = {
  title: string;
  className?: string;
  type?: HTMLButtonElement["type"];
  icon?: JSX.Element;
  onClick?: () => Promise<void> | void;
};

export default function Button({ title, className, type, icon, onClick }: ButtonProps) {
  return (
    <button
      type={type}
      className={`${className} group relative inline-flex items-center overflow-hidden rounded-sm bg-indigo-600 px-8 py-3 text-white`}
      onClick={onClick}
    >
      {icon && (
        <span className="absolute -start-full transition-all group-hover:start-4">
          {icon}
        </span>
      )}
      <span
        className={
          "text-sm font-medium group-hover:ms-4" + icon ? " transition-all" : ""
        }
      >
        {title}
      </span>
    </button>
  );
}

import { create } from "zustand";
import { capitalize } from "~/helpers/string-utils";
import { Icons } from "./Icons";

type ToastProps = {
  message: string | null;
  type: "info" | "success" | "error" | "warn";
  show: (message: string, type?: ToastProps["type"], timeout?: number) => void;
};

const types = {
  success: {
    icon: Icons["success-circled"],
    light: {
      border: "border-green-500",
      bg: "bg-green-50",
      text: "text-green-800",
    },
    dark: {
      border: "border-green-400",
      bg: "bg-green-800",
      text: "text-green-100",
    },
  },
  error: {
    icon: Icons["error-circled"],
    light: {
      border: "border-red-500",
      bg: "bg-red-50",
      text: "text-red-800",
    },
    dark: {
      border: "border-red-400",
      bg: "bg-red-800",
      text: "text-red-100",
    },
  },
  warn: {
    icon: Icons["warn-circled"],
    light: {
      border: "border-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-800",
    },
    dark: {
      border: "border-amber-400",
      bg: "bg-amber-800",
      text: "text-amber-100",
    },
  },
  info: {
    icon: Icons["info-circled"],
    light: {
      border: "border-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-800",
    },
    dark: {
      border: "border-blue-400",
      bg: "bg-blue-800",
      text: "text-blue-100",
    },
  },
};

export const useToast = create<ToastProps>(set => ({
  message: null,
  type: "info",
  show: (message, type = "info", timeout = 3000) => {
    set({ message, type });
    setTimeout(() => set({ message: null }), timeout);
  },
}));

export function Toast() {
  const { message, type } = useToast();
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`absolute z-10 w-60 top-4 right-4 p-4 shadow-sm rounded-md border ${types[type].light.border} dark:${types[type].dark.border} ${types[type].light.bg} dark:${types[type].dark.bg}`}
    >
      <div
        className={`flex items-start gap-4 ${types[type].light.text} dark:${types[type].dark.text}`}
      >
        {types[type].icon}

        <div className="flex-1">
          <strong className="block leading-tight font-medium">
            {capitalize(type)}
          </strong>

          <p className="mt-0.5 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}

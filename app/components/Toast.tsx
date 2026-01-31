import { create } from "zustand";
import { capitalize } from "~/helpers/string-utils";
import { Icons } from "./Icons";

type ToastProps = {
  message: string | null;
  type: "info" | "success" | "error" | "warn";
  show: (message: string, type?: ToastProps["type"], timeout?: number) => void;
};

export const useToast = create<ToastProps>((set) => ({
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

  const colors = {
    success: {
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

  return (
    <div
      role="alert"
      className={`p-4 absolute z-10 w-20 shadow-sm rounded-md border ${colors[type].light.border} dark:${colors[type].dark.border} ${colors[type].light.bg} dark:${colors[type].dark.bg}`}
    >
      <div
        className={`flex items-start gap-4 ${colors[type].light.text} dark:${colors[type].dark.text}`}
      >
        {Icons[type]()}

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

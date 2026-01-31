import type { ChangeEventHandler } from "react";

export type BaseInputProps = {
  id?: string;
  name: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
};

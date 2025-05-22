import type { IconType } from 'svelte-icons-pack';

export type DropdownReturnType<ValueType = unknown> = {
  selectValue?: ValueType,
  search?: string,
} | undefined;

export type IconButtonProps = {
  icon: IconType,
  onclick?: (e: MouseEvent) => void;
};

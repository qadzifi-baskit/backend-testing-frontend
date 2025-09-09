import type { IconType } from 'svelte-icons-pack';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type DropdownReturnType<ValueType = unknown> = {
  selectValue?: ValueType,
  search?: string,
} | undefined;

export type IconButtonProps = {
  icon: IconType,
  onclick?: (e: MouseEvent) => void;
} & HTMLButtonAttributes;

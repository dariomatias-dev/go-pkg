"use client";

import { Check, ChevronDown } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string = string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

export function Select<T extends string = string>({
  value,
  options,
  onChange,
  placeholder,
  className,
}: SelectProps<T>) {
  const selected = options.find((o) => o.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 pr-2.5 pl-3 text-xs font-semibold text-slate-700 shadow-sm transition-all outline-none select-none hover:bg-slate-50 focus-visible:border-[#00ADD8] focus-visible:ring-2 focus-visible:ring-[#00ADD8]/30 data-[state=open]:border-[#00ADD8] data-[state=open]:bg-slate-50 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#c9d1d9] dark:hover:bg-[#161b22] dark:focus-visible:border-sky-500 dark:data-[state=open]:border-sky-500 dark:data-[state=open]:bg-[#161b22]",
            className,
          )}
        >
          <span className="truncate">
            {selected?.label ?? placeholder ?? value}
          </span>
          <ChevronDown className="h-3 w-3 shrink-0 text-slate-400 transition-transform duration-150 data-[state=open]:rotate-180 dark:text-[#484f58]" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={6}
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 z-50 min-w-(--radix-dropdown-menu-trigger-width) overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-[#30363d] dark:bg-[#161b22]"
        >
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(v) => onChange(v as T)}
          >
            {options.map((option) => (
              <DropdownMenuPrimitive.RadioItem
                key={option.value}
                value={option.value}
                className={cn(
                  "relative flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors outline-none select-none",
                  "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-[#c9d1d9] dark:hover:bg-[#21262d] dark:hover:text-[#f0f6fc]",
                  "focus:bg-slate-50 focus:text-slate-900 dark:focus:bg-[#21262d] dark:focus:text-[#f0f6fc]",
                  "data-[state=checked]:bg-sky-50/60 data-[state=checked]:font-semibold data-[state=checked]:text-[#006680] dark:data-[state=checked]:bg-sky-950/20 dark:data-[state=checked]:text-sky-400",
                )}
              >
                <span>{option.label}</span>
                <DropdownMenuPrimitive.ItemIndicator>
                  <Check className="h-3 w-3 shrink-0 text-[#006680] dark:text-sky-400" />
                </DropdownMenuPrimitive.ItemIndicator>
              </DropdownMenuPrimitive.RadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

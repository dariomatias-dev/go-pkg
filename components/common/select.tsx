"use client";

import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

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
            "flex items-center gap-1.5 text-xs bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg py-1.5 pl-3 pr-2.5 font-semibold text-slate-700 dark:text-[#c9d1d9] shadow-sm outline-none hover:bg-slate-50 dark:hover:bg-[#161b22] focus-visible:ring-2 focus-visible:ring-[#00ADD8]/30 focus-visible:border-[#00ADD8] dark:focus-visible:border-sky-500 transition-all cursor-pointer select-none data-[state=open]:border-[#00ADD8] dark:data-[state=open]:border-sky-500 data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-[#161b22]",
            className,
          )}
        >
          <span className="truncate">
            {selected?.label ?? placeholder ?? value}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400 dark:text-[#484f58] shrink-0 transition-transform duration-150 data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-(--radix-dropdown-menu-trigger-width) overflow-hidden rounded-xl border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-xl p-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1"
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
                  "relative flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-medium outline-none cursor-pointer select-none transition-colors",
                  "text-slate-600 dark:text-[#c9d1d9] hover:bg-slate-50 dark:hover:bg-[#21262d] hover:text-slate-900 dark:hover:text-[#f0f6fc]",
                  "focus:bg-slate-50 dark:focus:bg-[#21262d] focus:text-slate-900 dark:focus:text-[#f0f6fc]",
                  "data-[state=checked]:text-[#007D9C] dark:data-[state=checked]:text-sky-400 data-[state=checked]:bg-sky-50/60 dark:data-[state=checked]:bg-sky-950/20 data-[state=checked]:font-semibold",
                )}
              >
                <span>{option.label}</span>
                <DropdownMenuPrimitive.ItemIndicator>
                  <Check className="w-3 h-3 text-[#007D9C] dark:text-sky-400 shrink-0" />
                </DropdownMenuPrimitive.ItemIndicator>
              </DropdownMenuPrimitive.RadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

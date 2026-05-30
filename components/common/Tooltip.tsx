import * as React from "react";

import {
  Tooltip,
  TooltipContent as RadixTooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function TooltipContent({
  className,
  ...props
}: React.ComponentProps<typeof RadixTooltipContent>) {
  return (
    <RadixTooltipContent
      className={cn("[@media(hover:none)]:hidden", className)}
      {...props}
    />
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

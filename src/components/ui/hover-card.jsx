import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "../../lib/cn";

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export function HoverCardContent({ className, sideOffset = 8, ...props }) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 rounded-md border border-line bg-paper p-4 shadow-lg data-[state=open]:animate-fade-in",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

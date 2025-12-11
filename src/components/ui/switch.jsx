import React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-5 w-9 items-center rounded-full border-2 transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className="block h-4 w-4 rounded-full bg-background transition-transform data-[state=checked]:translate-x-4"
    />
  </SwitchPrimitive.Root>
))

export { Switch }

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { list_state } from "@/lib/data" 

interface StateProps {
    setNegeri: (value: string) => void; 
    setCity: (value: string) => void; 
    setPostcode: (value: string) => void; 
} 

export default function State({ setNegeri, setCity, setPostcode }: StateProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue)
    setNegeri(selectedValue)
    setCity("") // Reset city when state changes
    setPostcode("") // Reset postcode when state changes
    setOpen(false)
  }

  return (
    <div className="w-1/3 pr-2"> 
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between mr-2 overflow-hidden"
          >
            {value || "☰ State"}
            {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search state..." />
            <CommandList>
              <CommandEmpty>No state found.</CommandEmpty>
              <CommandGroup>
                {list_state.map((state) => (
                  <CommandItem
                    key={state}
                    value={state}
                    onSelect={() => handleSelect(state)}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === state ? "opacity-100" : "opacity-0")} />
                    {state.charAt(0).toUpperCase() + state.slice(1)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

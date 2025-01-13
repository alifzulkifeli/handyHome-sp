import React from "react"
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


interface Props {
    category: string
    setCategory: (value: string) => void;
    list_category: any[]
}

const Category = ({ category, setCategory , list_category}: Props) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    

    const handleSelect = (selectedValue: any) => {
        setValue(selectedValue.name)
        setCategory(selectedValue.id)
        setOpen(false)
    }


    return (

       
            <div className=" mt-1 mb-2"> 
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between mr-2 overflow-hidden"
                >
                  {value || "☰ Category"}
                  {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search Category..." />
                  <CommandList>
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandGroup>
                    {list_category.map((state) => (
                      <CommandItem
                        key={state}
                        value={state}
                        onSelect={() => handleSelect(state)}
                      >
                        <Check className={cn("mr-2 h-4 w-4", value === state ? "opacity-100" : "opacity-0")} /> 
                         {state.name}
                      </CommandItem>
                    ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

    )
};

export default Category;

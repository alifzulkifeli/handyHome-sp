import { useState, useEffect } from "react"
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

import { list_state_cities } from "@/lib/data"

interface CityProps {
    negeri: string;
    setCity: (value: string) => void;
    setPostcode: (value: string) => void;
    city: string;
}

export default function City({ negeri, setCity, setPostcode, city }: CityProps) {
    const [open, setOpen] = useState(false)
    const [selectedCity, setSelectedCity] = useState(city || "")

    const handleSelect = (city: string) => {
        setSelectedCity(city)
        setCity(city)
        setPostcode("") // Reset postcode when a new city is selected
        setOpen(false)
    }

    useEffect(() => {
        setSelectedCity("")   // Reset selected city when state changes
        setCity("")            // Reset city state
        setPostcode("")        // Reset postcode when state changes
    }, [negeri, setCity, setPostcode])

    const cities = (list_state_cities as Record<string, string[]>)[negeri] || []

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
                        {selectedCity || "☰ City"}
                        {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandList>
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup>
                                {cities.map((city) => (
                                    <CommandItem
                                        key={city}
                                        value={city}
                                        onSelect={() => handleSelect(city)}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", selectedCity === city ? "opacity-100" : "opacity-0")} />
                                        {city}
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

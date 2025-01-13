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

import { list_city_postcodes } from "@/lib/data" // Import the postcodes by city

interface PostcodeProps {
    city: string;
    setPostcode: (value: string) => void;
    negeri: string;
}

export default function Postcode({ city, setPostcode , negeri}: PostcodeProps) {
    const [open, setOpen] = useState(false)
    const [selectedPostcode, setSelectedPostcode] = useState("")
    const [postcodes, setPostcodes] = useState<any[]>([])

    const handleSelect = (postcode: string) => {
        setSelectedPostcode(postcode) // Update local selected postcode
        setPostcode(postcode)         // Update parent postcode
        setOpen(false)                // Close the dropdown
    }

    // Effect to load postcodes whenever the city changes
    useEffect(() => {
        if (city) {
            const postcodesForCity = (list_city_postcodes as Record<string, number[]>)[city] || []
            setPostcodes(postcodesForCity)
            setSelectedPostcode("")  // Reset selected postcode when city changes
            setPostcode("")           // Also reset parent postcode state
        } else {
          setSelectedPostcode("")  // Reset selected postcode when city changes
          setPostcode("")           // Also reset parent postcode state
        }
    }, [negeri, city, setPostcode])

    return (
        <div className="w-1/3 ">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between mr-2 overflow-hidden"
                    >
                        {selectedPostcode || "☰ Postcode"}
                        {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Search postcode..." />
                        <CommandList>
                            <CommandEmpty>No postcode found.</CommandEmpty>
                            <CommandGroup>
                                {postcodes.map((postcode) => (
                                    <CommandItem
                                        key={postcode}
                                        value={postcode}
                                        onSelect={() => handleSelect(postcode)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedPostcode === postcode ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {postcode}
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

import { useState } from 'react'

export function useMultiSelect(initialItems: number[]) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const toggle = (item: number) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const isSelected = (item: number) => selectedItems.includes(item)

  return { selectedItems, toggle, isSelected }
}


import { useState } from 'react'

export function useTimeSelect() {
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])

  const toggle = (time: string) => {
    setSelectedTimes(prev =>
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    )
  }

  const isSelected = (time: string) => selectedTimes.includes(time)

  return { selectedTimes, toggle, isSelected }
}


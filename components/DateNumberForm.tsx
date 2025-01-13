'use client'

import { useEffect, useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTimeSelect } from '../hooks/useTimeSelect'
import { ScrollArea } from "@/components/ui/scroll-area"
import { log } from 'console'
import { pb } from '@/lib/pb'
import { useRouter } from 'next/router'
import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  times: z.array(z.string()).min(1, "At least one time must be selected.")
})

export function DateTimeForm() {
  const [date, setDate] = useState<Date>()
  const times = Array.from({ length: 12 }, (_, i) => `${i + 9}:00`)
  const { selectedTimes, toggle, isSelected } = useTimeSelect()
  const [User, setUser] = useState<any>(null)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      times: [],
    },
  })

    useEffect(() => {
      let otherUser: [] = [];
      const fetchUser = async () => {
        try {
          let user:  { id: string }  | null = null;
          const userStorage = localStorage.getItem('sp');
          if (userStorage) {
            user = JSON.parse(userStorage);
            setUser(user);
          } else {
            console.log('No user found in localStorage');
            return;
          }
        }
        catch (error) {
          console.error(error)
        }
      }
      fetchUser();
    }
    , [])



    async function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values);
    
      try {
        for (const value of values.times) {
          const data = {
            provider_id: User.id,
            date: values.date,
            time_block: value.split(":")[0],
          };
    
          await pb.collection('Availabilities').create(data);
        }
        toast({
          title: "✅ Time slot added",
          description: "Your time slot has been added to the list.",
          color: "success",
        })
        router.push('/');
      } catch (error) {
        console.error(error);
      }
    }
    
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel className="mb-2 self-start">Date</FormLabel>
              <div className="flex justify-center w-full">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date)
                    setDate(date)
                  }}
                  className="rounded-md border"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="times"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-2">Select Times</FormLabel>
              <FormControl>
                <ScrollArea className="h-[230px] rounded-md border p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {times.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={isSelected(time) ? "default" : "outline"}
                        className="w-full"
                        onClick={() => {
                          toggle(time)
                          field.onChange(isSelected(time)
                            ? field.value.filter(t => t !== time)
                            : [...field.value, time]
                          )
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
  )
}


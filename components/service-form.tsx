"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { pb } from "@/lib/pb"
import { useRouter } from "next/router"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  serviceName: z.string().min(2, {
    message: "Service name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number.",
  }),
  timeTaken: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Time taken must be a valid number.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
})




export function ServiceForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceName: "",
      description: "",
      price: "",
      timeTaken: "",
      category: "",
    },
  })

  const [User, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<any>(null)
  const router = useRouter()


  useEffect(() => {
    let otherUser: [] = [];
    const fetchUser = async () => {
      try {
        let user: { id: string } | null = null;
        const userStorage = localStorage.getItem('sp');
        if (userStorage) {
          user = JSON.parse(userStorage);
          setUser(user);
        } else {
          console.log('No user found in localStorage');
          return;
        }

        const records = await pb.collection('ServiceCategories').getFullList({
          sort: '-created',
      });

      const mappedRecords: any[] = records.map(record => ({
        id: record.id,
        name: record.name,
      }));

      setCategories(mappedRecords);


      }
      catch (error) {
        console.error(error)
      }
    }
    fetchUser();
  }
    , [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    // example create data
    const data = {
      "provider_id": User.id,
      "service_name": values.serviceName,
      "description": values.description,
      "price": Number(values.price),
      "time_taken": Number(values.timeTaken),
      "category": values.category,
    };

    const record = await pb.collection('Services').create(data);
    console.log(record);
    toast({
      title: "✅ New service added",
      description: "New service has been added to the list.",
      color: "success",
    })
    router.push('/');

    // Here you would typically send the form data to your backend
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="serviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter service name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your service"
                  // className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Enter price" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeTaken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Taken</FormLabel>
              <FormControl>
                <Input placeholder="Enter time in hours" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="gardening">Gardening</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="tutoring">Tutoring</SelectItem>
                  <SelectItem value="other">Other</SelectItem> */}
                  { categories && categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">Submit</Button>
      </form>
    </Form>
  )
}


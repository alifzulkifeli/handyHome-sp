import { pb } from "@/lib/pb";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Page from '@/components/page'
import Section from '@/components/section'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Label } from '@/components/ui/label'
import Link from 'next/link'



import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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


const OrderDetails = () => {

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

    const [categories, setCategories] = useState<any>(null)
    const router = useRouter()
    const [user, setUser] = useState<{ id: string } | null>(null)
    const [service, setService] = useState<any>(null)
    const { id } = router.query;

    useEffect(() => {
        const fetchOrder = async (id: string | string[] | undefined) => {
            if (!id || typeof id !== 'string') return;

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
                const record = await pb.collection('Services').getOne(id,
                    {
                        expand: 'category'
                    }
                );

                console.log(record);
                setService(record);

                form.setValue('serviceName', record.service_name);
                form.setValue('description', record.description);
                form.setValue('price', String(record.price));
                form.setValue('timeTaken', String(record.time_taken));
                form.setValue('category', record.expand?.category?.name || "");


            } catch (error) {
                console.log("Error fetching order:", error);
            }


        }

        fetchOrder(router.query.id);

    }, [router.query.id]); // Depend on just the id, not the entire router.query object

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)

        const data = {
            "provider_id": user?.id || "",
            "service_name": values.serviceName,
            "description": values.description,
            "price": Number(values.price),
            "time_taken": Number(values.timeTaken),
            "category": values.category,
        };

        if (typeof id === 'string') {
            const record = await pb.collection('Services').update(id, data);
            console.log(record);
        } else {
            console.error('Invalid id:', id);
        }

        toast({
            title: "✅ Service data updated",
            description: "Service data has been updated.",
            color: "success",
        })
        router.push('/');


    }
    return (
        <Page padding={5} nav={false}>
            <Section>
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
                                    {/* <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories && categories.map((category: any) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select> */}
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories && categories.map((category: any) => (
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

            </Section>

        </Page>
    );
}

export default (OrderDetails);
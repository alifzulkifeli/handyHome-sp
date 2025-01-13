
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Page from "@/components/page"
import Section from "@/components/section"
import { useRouter } from "next/router"
import { pb } from "@/lib/pb"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ServiceForm } from "@/components/service-form"


export default function Addservice() {
    const { toast } = useToast()
    const router = useRouter()

    const [email, setEmail] = useState("company@company.com")
    const [password, setPassword] = useState('12345678')
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        try {

            const authData = await pb.collection('Users').authWithPassword(
                form.email.value,
                form.password.value
            );
            const record = await pb.collection('ServiceProviders').getFirstListItem(`email="${form.email.value}"`);

            if (!record) {
                throw new Error("Provider Account not found");
            }

            console.log(authData);
            localStorage.setItem('pocketbase_auth', JSON.stringify(authData));
            localStorage.setItem('sp', JSON.stringify(record));

            window.location.replace('/');
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Service Provider Account not found. Please check your email and password.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }

        console.log(form.email.value);
        console.log(form.password.value);

    }


    return (
        <Page padding={3} nav={false}>
            <Section>
                <div className=" flex items-center justify-center ">
                    <main className="container mx-auto p-2 max-w-md  ">
                        <h1 className="text-2xl font-bold mb-4 text-center">Create new service</h1>
                        <ServiceForm />
                    </main>
                </div>
            </Section>
        </Page>
    )
}


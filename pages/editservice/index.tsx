
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Page from "@/components/page"
import Section from "@/components/section"
import { useRouter } from "next/router"
import { pb } from "@/lib/pb"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ServiceForm } from "@/components/service-form"
import { List } from "lucide-react"
import Card from "@/components/card"
import CardService from "@/components/card-service"


export default function ListService() {

    interface RecordModel {
        id: string;
        name: string;
        // Add other fields as necessary
    }

    const [services, setServices] = useState<any>([])
    const [user, setUser] = useState<{ id: string } | null>(null)
    const router = useRouter()

    useEffect(() => {

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

                const records = await pb.collection('Services').getFullList({
                    filter: user ? `provider_id.id="${user.id}"` : '',
                    sort: '-created',
                });

                console.log(records);
                
           
                setServices(records);


                const mappedRecords: any[] = records.map(record => ({
                    id: record.id,
                    name: record.name,
                }));



            }
            catch (error) {
                console.error(error)
            }
        }
        fetchUser();
    }
        , [])


    return (
        <Page padding={3}>
            <Section>
                <div></div>
                <h2 className="text-2xl font-bold mb-4">Manage Services</h2>
                {services.length > 0 ? (
                    services.map((service:any, index:number) => (
                        <div key={index} >
                            <CardService data={service} />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center pt-40 px-4">
                    <div className="text-primary w-24 h-24 mb-8">
                        <List size={96} />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-4 text-center">No Items Found</h1>
                    <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
                         Start by selecting a location and category to find services.
                    </p>
                    
                </div>
                )}
            </Section>
        </Page>
    )
}


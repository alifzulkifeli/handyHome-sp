import BackHome from '@/components/backHome'
import Card from '@/components/card'
import { MobileDashboard } from '@/components/Dashboard'
import Category from '@/components/dd-category'
import City from '@/components/location/dd-city'
import Postcode from '@/components/location/dd-postcode'
import State from '@/components/location/dd-state'
import Page from '@/components/page'
import Section from '@/components/section'
import { pb } from '@/lib/pb'
import { List } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Index = () => {
    const [negeri, setNegeri] = useState<any>();
    const [city, setCity] = useState<any>();
    const [postcode, setPostcode] = useState<any>();
    const [category, setCategory] = useState<any>();
    const [services, setServices] = useState<any[]>([]);
    const [list_category, setListCategory] = useState<any[]>([])

    const router = useRouter();
    const [user, setUser] = useState<any>(null)

   

    // Save scroll position before the component unmounts or before navigation
    useEffect(() => {
        // window.location.reload();  

        let user: { model: { id: string } } | null = null;
        const userStorage = localStorage.getItem('pocketbase_auth');
        if (userStorage) {
            user = JSON.parse(userStorage);
            setUser(user);
        } else {
            console.log('No user found in localStorage');
            return;
        }
        if (!user) {
            console.log('User is null');
            return;
        }
    }, []);


    return (
        <Page padding={3}>
            <Section>
                {user ? (
                    <div>
                        <MobileDashboard />
                    </div>
                ) : (
                    <BackHome />
                )}
            </Section>
        </Page>
    );
}

export default Index;

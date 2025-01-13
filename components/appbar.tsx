import { pb } from '@/lib/pb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import Image from 'next/image'


// Extend the Window interface to include deferredPrompt
declare global {
    interface Window {
        deferredPrompt: any;
    }
}

const links = [
    { label: 'Story', href: '/story' },
    { label: 'Recipes', href: '/recipes' },
]



const Appbar: React.FC = () => {

    const router = useRouter()
    const isHomePage = router.pathname === '/'
    const isChatPage = router.pathname === '/chat'
    const isOrderPage = router.pathname === '/order'
    const [user, setUser] = useState<any>(null)
    const [installable, setInstallable] = useState(false);

    const handleLogout = async () => {
        await pb.authStore.clear()
        localStorage.removeItem('sp')
        setUser(null)

        router.push('/')
    }

    
    const handleInstallClick = async () => {
        if (window.deferredPrompt) {
            const deferredPrompt = window.deferredPrompt;
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;

            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }

            // Reset the deferredPrompt for future attempts
            window.deferredPrompt = null;
            setInstallable(false);
        } else {
            console.log('No deferredPrompt event available');
        }
    }

    useEffect(() => {
        // Fetch user on mount
        const fetchUser = async () => {
            try {
                const user = await pb.collection("users").authRefresh();
                setUser(user.record);
            } catch (error) {
                console.log(error);
            }
        }

        fetchUser();
    }, [pb.authStore]);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            // Store the event for later use
            window.deferredPrompt = e;
            setInstallable(true);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    return (
        <div className='fixed top-0 left-0 z-20 w-full bg-zinc-900 pt-safe'>
            <header className='border-b bg-zinc-100 px-safe dark:border-zinc-800 dark:bg-zinc-900'>
                <div className='mx-auto flex h-16 max-w-screen-md items-center justify-between px-6'>
                    <div>

                        {isHomePage || isChatPage || isOrderPage ? (
                            <Link href='/'>
                                <img src="/images/logo-dark.png" className='h-12' alt="Logo" />
                            </Link>
                        ) : (
                            <button onClick={() => router.back()} className='text-blue-600'>
                                {"< Back"}
                            </button>
                        )}
                    </div>
                    <div>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        { user.avatar ?
                                        <AvatarImage src={ `https://pb.alifz.xyz/api/files/_pb_users_auth_/${user.id}/${user.avatar}`} />
                                        :<AvatarImage src='https://pb.alifz.xyz/api/files/novm4dln6wcco7x/tnxkz1axt5fvz16/l60_hf_1_QJJvJvC9BM.png'/> 
                                    }
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel onClick={() => router.push('/profile')}  >My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/install')} >Install Guide</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} >Log out</DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                            // <p>asd</p>
                        ) : (
                            <div>
                                <Button onClick={() => router.push("/login")} >Login</Button>
                            </div>
                        )}

                    </div>


                </div>
            </header>
        </div>
    )
}

export default Appbar
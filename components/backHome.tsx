import { useEffect, useState } from "react";
import { ShoppingBag, LogIn, Lock, MessageSquare, List } from 'lucide-react'
import Link from "next/link";
import { Button } from "react-day-picker";

const BackHome = () => {

    const [user, setUser] = useState<any>('')

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                let user: { model: { id: string } } | null = null;
                const userStorage = localStorage.getItem('pocketbase_auth');
                if (userStorage) {
                    user = JSON.parse(userStorage);
                } else {
                    console.log('No user found in localStorage');
                    return;
                }

                if (user) {
                    setUser(user.model)
                }
            } catch (error) {
                console.log(error)
            }

        }
        fetchMessages()
    }, [])


    return (
        <div>
            {user ? <div>
                <div className="flex flex-col items-center justify-center pt-40 px-4">
                    <div className="text-primary w-24 h-24 mb-8">
                        <List size={96} />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-4 text-center">No Items Yet</h1>
                    <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
                        This part is empty, yet...
                    </p>
                    
                </div></div> :
                <div>
                    <div className="flex flex-col items-center justify-center pt-40 px-4">
                        <div className="text-primary w-24 h-24 mb-8">
                            <Lock size={96} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Authentication Required</h1>
                        <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
                            Please log in to view this page and access your account information.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center px-6 py-3 border  text-base font-medium rounded-md text-black bg-"
                        >
                            <LogIn className="w-5 h-5 mr-2" />
                            Go to Login
                        </Link>
                    </div>
                </div>
            }
        </div>
    );
}

export default BackHome;
"use client"

import * as React from "react"
import { Plus, Clock, Briefcase, Star, CircleCheckBig, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { pb } from "@/lib/pb"
import { useRouter } from "next/router"
import { log } from "console"




export function MobileDashboard() {
    
    const router = useRouter();
    
    const [user, setUser] = React.useState<any>(null)
    const [totalCompletedOrders, setTotalCompletedOrders] = React.useState<any>(0)
    const [totalRevenue, setTotalRevenue] = React.useState<any>(0)
    const [last30DaysRevenue, setLast30DaysRevenue] = React.useState<any>(0)
    const [ongoingOrders, setOngoingOrders] = React.useState<any>(0)
    const [last5monthsRevenuegroupedbyMonth, setLast5monthsRevenueGroupedbyMonth] = React.useState<any>(0)
    const [reviews, setReviews] = React.useState<any>([])

    React.useEffect(() => {

    
        const fetchMessages = async () => {
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

                if (!user) {
                    console.log('User is null');
                    return;
                }

                console.log(user);


                const booking_records = await pb.collection('Bookings').getFullList({
                    filter: `service_id.provider_id.id="${user.id}"`,
                    expand: 'user_id,service_id.provider_id,provider_id',
                    sort: '-created',
                });

                const reviews = await pb.collection('ReviewRatings').getList(1, 3 ,{
                    filter: `provider_id="${user.id}"`,
                    expand: 'user_id',
                    sort: '-created',
                });

                console.log(reviews);
                

                console.log(booking_records);

                const totalCompletedOrders = booking_records.filter((booking: any) => booking.status === 'Completed').length;
                const totalRevenue = booking_records.reduce((acc: number, booking: any) => acc + booking.price, 0);
                const last30DaysRevenue = booking_records.filter((booking: any) => booking.status === 'Completed').reduce((acc: number, booking: any) => acc + booking.price, 0);
                const ongoingOrders = booking_records.filter((booking: any) => booking.status === 'Ongoing').length;


                const last5MonthsRevenue = booking_records.filter((booking: any) => booking.status === 'Completed').reduce((acc: any, booking: any) => {
                    const date = new Date(booking.booking_date);
                    const month = date.toLocaleString('default', { month: 'short' });
                    acc[month] = acc[month] ? acc[month] + booking.price : booking.price;
                    return acc;
                }, {});

                const formattedLast5MonthsRevenue = Object.keys(last5MonthsRevenue).map(month => ({
                    name: month,
                    value: last5MonthsRevenue[month]
                }));

                const reviewsData = reviews.items.map((review: any) => ({
                    id: review.id,
                    author: review.expand.user_id.name,
                    comment: review.review_text,
                    rating: review.rating
                }));



                console.log(reviewsData);
                

                setTotalCompletedOrders(totalCompletedOrders);
                setTotalRevenue(totalRevenue);
                setLast30DaysRevenue(last30DaysRevenue);
                setOngoingOrders(ongoingOrders);
                setLast5monthsRevenueGroupedbyMonth(formattedLast5MonthsRevenue);
                setReviews(reviewsData);

                console.log(totalCompletedOrders, totalRevenue, last30DaysRevenue, ongoingOrders);
                console.log(formattedLast5MonthsRevenue.reverse());

                

            }
            catch (error) {
                console.log('Error fetching user:', error)
            }

        }
        fetchMessages()
    }, [])


    return (
        <div>
            {user ? (
                <div className="grid grid-cols-1 gap-4">

                    <h2 className="font-bold text-lg" >Hi, {user.name}</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" size="lg" onClick={() => router.push("/addslot")} >
                            
                        ➕  Add New Time Slot
                        </Button>
                        <Button variant="outline" size="lg"  onClick={() => router.push("/addservice")}>
                           
                        ➕  Add New Services
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => router.push("/editslot")} >
                          
                            ✏️ Manage Time Slot
                        </Button>
                        <Button variant="outline" size="lg"  onClick={() => router.push("/editservice")}>
                        
                            ✏️ Manage Services
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{ongoingOrders}</div>
                                <p className="text-xs text-muted-foreground">Ongoing Orders</p>
                            </CardContent>
                        </Card>
                     
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    <CircleCheckBig className="h-4 w-4 text-muted-foreground" />
                             
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalCompletedOrders}</div>
                                <p className="text-xs text-muted-foreground">Total Orders Completed</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">RM {last30DaysRevenue}</div>
                                <p className="text-xs text-muted-foreground">Revenue last 30 days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">RM {totalRevenue}</div>
                                <p className="text-xs text-muted-foreground">Total Revenue </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card >
                        <CardHeader>
                            <CardTitle>Monthly Revenue</CardTitle>
                        </CardHeader>
                        <CardContent className="w-full" >
                            <div className="h-[200px] bg-white dark:bg-gray-800 rounded-md ">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={last5monthsRevenuegroupedbyMonth} >
                                        <XAxis dataKey="name" stroke="black" />
                                        <YAxis stroke="black" />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="black" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {reviews.map((review: any) => (
                                    <li key={review.id} className="border-b pb-2 last:border-b-0">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">{review.author}</span>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                <span>{review.rating}/5</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div>
                    <h1>Not logged in</h1>
                </div>
            )
            }
        </div>
    )
}


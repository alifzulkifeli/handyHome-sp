import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Page from "@/components/page"
import Section from "@/components/section"

export default function TabsDemo() {
    return (
        <Page padding={3} nav={false} fromChat={true} >
            <Section>
                <Tabs defaultValue="ios" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="ios">iOS</TabsTrigger>
                        <TabsTrigger value="android">Android</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ios">
                        <Card>
                            <CardHeader>
                                <CardTitle>Install on iOS</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            
                                <ol className="list-decimal list-inside space-y-2">
                                    <li>Click on the share icon</li>
                                    <Image
                                    src="/images/install/image5_install.png"
                                    alt=""
                                    width={300}
                                    height={200}
                                    className="rounded-lg  mx-auto"
                                />
                                    <li>Choose the &#34;Add to Home Screen&#34;</li>
                                    <Image
                                    src="/images/install/image6_install.png"
                                    alt=""
                                    width={300}
                                    height={200}
                                    className="rounded-lg  mx-auto"
                                />
                                    <li>Click &#34;Add&#34;</li>
                                    <Image
                                    src="/images/install/image7_install.png"
                                    alt=""
                                    width={300}
                                    height={200}
                                    className="rounded-lg  mx-auto"
                                />
                           
                                </ol>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="android">
                        <Card>
                            <CardHeader>
                                <CardTitle>Install on Android</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                          
                                <ol className="list-decimal list-inside space-y-2">
                                    <li>Click on the three dot icon</li>
                                    <Image
                                    src="/images/install/image1_install.png"
                                    alt=""
                                    width={300}
                                    height={200}
                                    className="rounded-lg  mx-auto"
                                />
                                    <li>Choose &#34;Add to home screen&#34;</li>
                                    <Image
                                    src="/images/install/image2_install.png"
                                    alt=""
                                    width={300}
                                    height={200}
                                    className="rounded-lg  mx-auto"
                                />
                                    <li>Choose &#34;Install&#34;</li>
                                    <Image
                                    src="/images/install/image3_install.png"
                                    alt=""
                                    width={300}
                                    height={200}
                                    className="rounded-lg  mx-auto"
                                />
                                    <li>Tap &#34;Install&#34;</li>
                                    <Image
                                    src="/images/install/image4_install.png"
                                    alt=""
                                    width={300}
                                    height={200}
                                    className="rounded-lg  mx-auto"
                                />
                 
                                </ol>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </Section>
        </Page>
    )
}


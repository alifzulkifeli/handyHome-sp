
import Page from "@/components/page"
import Section from "@/components/section"

import AppointmentList from "@/components/AppointmentList"


export default function Editslot() {


    return (
        <Page padding={4} nav={false}>
            <Section>
                <div className=" flex items-center justify-center ">
                    <main className="container mx-auto p-2 max-w-md  ">
                        <AppointmentList />
                     
                    </main>
                </div>
            </Section>
        </Page>

    )
}


import { Toaster } from "@/components/ui/toaster"

interface Props {
	children: React.ReactNode
}


const Section = ({ children }: Props) => {

	

	return ( 
		<>
	<section className='' >{children}</section> 
	<Toaster  />
		</>
	
);
}
 
export default Section;
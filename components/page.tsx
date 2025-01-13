import Head from 'next/head'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'

interface Props {
	title?: string
	children: React.ReactNode
	padding: number
	nav?: boolean
	fromChat?: boolean
}

const Page = ({ title, children, padding = 6, fromChat = false, nav = true }: Props) => (
	<>
		{title ? (
			<Head>
				<title>HandyHome | {title}</title>
			</Head>
		) : null}

		<Appbar />

		{fromChat ? (
			<main
				className='mx-auto max-w-screen-md pt-20  px-safe sm:pb-0'
			>
				<div className={'p-' + padding}>{children}</div>
			</main>
		) : (

			<main
				className='mx-auto max-w-screen-md pt-20 pb-16 px-safe sm:pb-0'
			>
				<div className={'p-' + padding}>{children}</div>
			</main>
		)}


		{nav ? <BottomNav /> : null}

	</>
)

export default Page

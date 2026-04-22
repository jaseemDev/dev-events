import Link from "next/link";
import Image from "next/image";


const Navbar = () => {
    return (
        <header>
            <nav>
                <Link href={"/"} className={"flex gap-1"}>
                    <Image src={"/icons/logo.png"} alt={"logo"} width={24} height={24}/>
                    DevEvents
                </Link>
                <ul>
                    <Link href={"/"}>Home</Link>
                    <Link href={"/events"}>Events</Link>
                    <Link href={"/events/create"}>Create Events</Link>
                </ul>
            </nav>
        </header>
    )
}
export default Navbar

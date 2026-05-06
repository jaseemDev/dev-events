import React from 'react'
import {notFound} from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import {IEvent} from "@/database";
import {getSimilarEventsBySlug} from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

const EventDetailsItem = ({icon, alt, label}: { icon: string, alt: string, label: string }) => {
    return <div className={"flex-row-gap-2 items-center"}>
        <Image src={icon} alt={alt} width={17} height={17}/>
        <p>{label}</p>
    </div>
}

const EventAgenda = ({agendaItems}: { agendaItems: string[] }) => {
    return <div className={"agenda"}>
        <h2>Agenda:</h2>
        <ul>
            {agendaItems?.map((agendaItem) => (
                <li key={agendaItem}>  {agendaItem} </li>
            ))}
        </ul>
    </div>
}

const EventTags = ({tags}: { tags: string[] }) => {
    return <div className={"flex flex-row gap-1.5 flex-wrap"}>
        {tags?.map((tag) => (
            <div className={"pill"} key={tag}>{tag}</div>
        ))}
    </div>
}


const EventDetails = async ({params}: { params: Promise<{ slug: string }> }) => {
    const {slug} = await params

    const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`)
    const {data} = await result.json()

    if (!data) return notFound()
    const bookings = 10
    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)
    console.log(similarEvents)

    return (
        <section id={"event"}>
            <div className={"header"}>
                <h1>{data.title}</h1>
                <p>{data.description}</p>
            </div>
            <div className={"details"}>
                {/*left side event content*/}
                <div className={"content"}>
                    <Image src={data.image} alt={"event banner"} width={800} height={800} className={"banner"}/>
                    <section className={"flex-col-gap-2"}>
                        <h2>Overview:</h2>
                        <p>{data.overview}</p>
                    </section>
                    <section className={"flex-col-gap-2"}>
                        <h2>Event Details:</h2>
                        <EventDetailsItem icon={"/icons/calendar.svg"} alt={"calendar"} label={data.date}/>
                        <EventDetailsItem icon={"/icons/clock.svg"} alt={"clock"} label={data.time}/>
                        <EventDetailsItem icon={"/icons/pin.svg"} alt={"location"} label={data.location}/>
                        <EventDetailsItem icon={"/icons/mode.svg"} alt={"mode"} label={data.mode}/>
                        <EventDetailsItem icon={"/icons/audience.svg"} alt={"audience"} label={data.audience}/>
                    </section>
                    <EventAgenda agendaItems={data.agenda}/>
                    <section className={"flex-col-gap-2"}>
                        <h2>About the Organizer</h2>
                        <p>{data.organizer}</p>
                    </section>
                    <EventTags tags={data.tags}/>
                </div>
                {/*right side - booking form*/}
                <aside className={"booking"}>
                    <div className={"signup-card"}>
                        <h2>Book your spot</h2>
                        {
                            bookings > 0 ? (
                                <p className={"text-sm"}>Join {bookings} people who have already booked</p>
                            ) : <p className={"text-sm"}>Be the first to book your spot!</p>
                        }

                        <BookEvent/>
                    </div>
                </aside>
            </div>
            <div className={"flex w-full flex-col gap-4 pt-20"}>
                <h2>Similar Events</h2>
                <div className={"events"}>
                    {
                        similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
                            <EventCard key={similarEvent.title} {...similarEvent} />
                        ))
                    }
                </div>

            </div>
        </section>
    )
}
export default EventDetails

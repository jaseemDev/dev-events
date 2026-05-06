import React from 'react'
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {IEvent} from "@/database";
import {cacheLife} from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const Page = async () => {
    'use cache'
    cacheLife("hours")
    const response = await fetch(`${BASE_URL}/api/events`);
    const events = await response.json();
    console.log(events)

    return (
        <section>
            <h1 className={"text-center"}>
                The hub for every dev <br/> event you can't miss
            </h1>
            <p className={"text-center mt-5"}>Hackathons, Meetups & Conferences, All in One Place</p>
            <ExploreBtn/>
            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>
                <ul className={"events"}>
                    {
                        events && events?.data?.length > 0 && events?.data?.map((event: IEvent) => (
                            <li className={"event"} key={event.title}>
                                <EventCard {...event} />
                            </li>
                        ))
                    }
                </ul>
            </div>
        </section>
    )
}
export default Page

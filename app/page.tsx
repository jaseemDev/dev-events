import React from 'react'
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {events} from "@/lib/constants";

const Page = () => {

    return (
        <section>
            <h1 className={"text-center"}>
                The hub for every dev <br /> event you can't miss
            </h1>
            <p className={"text-center mt-5"}>Hackathons, Meetups & Conferences, All in One Place</p>
            <ExploreBtn />
            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>
                <ul className={"events"}>
                    {
                        events.map((event, index) => (
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

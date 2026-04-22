export type EventItems = {
    image: string,
    title: string,
    location: string,
    time: string,
    date: string,
    slug: string,
}

export const events: EventItems[] = [
    {
        title: "Dubai Tech Summit 2026",
        image: "/images/event1.png",
        slug: "dubai-tech-summit-2026",
        location: "Dubai World Trade Centre, Dubai",
        date: "May 12, 2026",
        time: "10:00 AM - 5:00 PM",
    },
    {
        title: "Desert Music Festival",
        image: "/images/event2.png",
        slug: "desert-music-festival",
        location: "Al Marmoom Desert Conservation Reserve",
        date: "June 5, 2026",
        time: "6:00 PM - 2:00 AM",
    },
    {
        title: "Startup Pitch Night",
        image: "/images/event3.png",
        slug: "startup-pitch-night",
        location: "AstroLabs, JLT, Dubai",
        date: "April 28, 2026",
        time: "7:00 PM - 10:00 PM",
    },
    {
        title: "Art & Culture Expo",
        image: "/images/event4.png",
        slug: "art-culture-expo",
        location: "Alserkal Avenue, Al Quoz",
        date: "May 20, 2026",
        time: "11:00 AM - 8:00 PM",
    },
    {
        title: "Food Carnival Dubai",
        image: "/images/event5.png",
        slug: "food-carnival-dubai",
        location: "Zabeel Park, Dubai",
        date: "May 15, 2026",
        time: "4:00 PM - 11:00 PM",
    },
    {
        title: "AI & Future Tech Conference",
        image: "/images/event6.png",
        slug: "ai-future-tech-conference",
        location: "Dubai Internet City",
        date: "June 10, 2026",
        time: "9:00 AM - 4:00 PM",
    },
]
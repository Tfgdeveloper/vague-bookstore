
import Hero from "../components/Hero";
import { FreshlyShelved, StaffSelections } from "../components/Homeshelves";
import { getNewBooks, getTopInGenre } from "../data/bookQueries";
import FeaturedBook from "../components/Featuredbook";
import BestSeller from "../components/BestSeller";
import TopGenres, { CollectionShelves } from "../components/TopGenres";
import UpcomingEvents from "../components/Reviews";
import QuoteNewsletter from "../components/QuoteNewsletter";
import PromiseStrip from "../components/PromiseStrip";
import { BOOKS } from "../data/books";
import Reviews from "../components/Reviews";

const Home = () => {
  return (
    <div>
      
      <Hero
        variant="split"
        eyebrow="Established MMXV"
        title="For the love of a good book."
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley"
        image="/images/hero.png"
        imageAlt="Reading room with books stacked on a wooden desk"
        primaryAction={{ label: "Browse autumn collection", to: "/new-books" }}
        secondaryAction={{ label: "Our philosophy", to: "/about" }}
      />
      <CollectionShelves />
      <TopGenres />
      <StaffSelections  description=""/>
      <FeaturedBook 
        bookId="protege-of-the-sea-wolf" 
        eyebrow="Book of the month" 
        background="/images/featured-bg.png" //theme={{ "image-bg": "#1F2A44" }}
      />
      <FreshlyShelved 
        eyebrow="Reader favourites" 
        title="Top Novels" 
        books={getTopInGenre("novel")} />
      <BestSeller  authorId="donald-g-newman" />
      <FreshlyShelved
        eyebrow="Just added"
        title="New this week"
        books={getNewBooks(5)}
      />
      
      <Reviews/>
      <QuoteNewsletter
      eyebrow="The monthly letter"
      title={"New books.\nDelivered with care."}
      description="Your own description."
      buttonLabel="Subscribe"
      privacyTo="/privacy"            // or null to hide the Privacy Policy line
      onSubscribe={(email) => fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) })}
      />

      
    </div>
  )
}

export default Home

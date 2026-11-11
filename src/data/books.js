/* ==================================================================
   BookNShelves data — the one file for genres, authors and books.

   1. GENRES     main genres, each with its sub-genres.
                 Optional per genre or sub-genre:
                   hero:     { eyebrow, title, description, primaryAction, secondaryAction }
                   featured: { bookId, eyebrow, heading, note }
   2. AUTHORS
   3. BOOK_LIST  put main genres and sub-genres together in "genres":
                   "genres": ["fiction", "historical-fiction"],
   4. Helpers    used by the mega menu, genre pages and book pages.

   Pages:  /fiction                      main genre
           /fiction/historical-fiction   sub-genre
           /new-books                    newest books
   ================================================================== */

export const GENRES = [
  {
    slug: "fiction",
    name: "Fiction Books",
    description: "Short stories and literary fiction that stay with you long after the last page.",
    hero: {
      eyebrow: "Browse by genre",
      title: "Fiction",
      description: "Imagined worlds and invented lives that still tell the truth about people.",
    },
    featured: {
      bookId: "daywalker-vampire-princess-book-1-genesis",
      eyebrow: "Fiction pick of the month",
      heading: "Worlds worth\nwandering into.",
    },
    subgenres: [
      { slug: "literary-fiction", name: "Literary Fiction", description: "Thought-provoking stories with rich characters and beautiful writing." },
      { slug: "historical-fiction", name: "Historical Fiction", description: "Stories set in the past, bringing history and imagination together." },
      { slug: "romance", name: "Romance", description: "Love stories, relationships and unforgettable emotional journeys." },
      { slug: "fantasy", name: "Fantasy", description: "Magical worlds, mythical creatures and extraordinary adventures." },
      { slug: "science-fiction", name: "Science Fiction", description: "Futuristic worlds, technology and imaginative possibilities." },
      { slug: "contemporary-fiction", name: "Contemporary Fiction", description: "Modern stories exploring everyday life and human relationships." },
      { slug: "classics", name: "Classic Fiction", description: "Timeless literary works that continue to inspire generations." },
      { slug: "short-stories", name: "Short Stories", description: "Powerful narratives and memorable moments in shorter form." },
      { slug: "adventure", name: "Adventure", description: "Exciting journeys, discoveries and daring experiences." },
      { slug: "humor-satire", name: "Humor & Satire", description: "Witty storytelling, comedy and clever social observations." },
    ],
  },
  {
    slug: "novel",
    name: "Novels",
    description: "Long-form stories, from family sagas to quiet modern classics.",
    hero: {
      eyebrow: "Browse by genre",
      title: "Novels",
      description: "Long-form stories to sink into, from sweeping historical sagas to quiet modern lives.",
    },
    featured: {
      bookId: "the-dixie-gatsby",
      eyebrow: "Novel of the month",
      heading: "Stories with\nroom to breathe.",
    },
    subgenres: [
      { slug: "classic-novels", name: "Classic Novels", description: "Beloved novels that have stood the test of time." },
      { slug: "romantic-novels", name: "Romantic Novels", description: "Stories centered on love, connection and relationships." },
      { slug: "historical-novels", name: "Historical Novels", description: "Immersive stories inspired by different historical periods." },
      { slug: "literary-novels", name: "Literary Novels", description: "Character-driven stories with depth and artistic storytelling." },
      { slug: "adventure-novels", name: "Adventure Novels", description: "Epic journeys, challenges and thrilling discoveries." },
      { slug: "social-novels", name: "Social Novels", description: "Stories exploring society, culture and human struggles." },
      { slug: "psychological-novels", name: "Psychological Novels", description: "Complex characters, inner conflicts and human behavior." },
      { slug: "family-sagas", name: "Family Sagas", description: "Generational stories of family, legacy and relationships." },
    ],
  },
  {
    slug: "non-fiction",
    name: "Non Fiction",
    description: "History, memoir, ideas and true stories, told by people who lived or studied them.",
    hero: {
      eyebrow: "Browse by genre",
      title: "Non Fiction",
      description: "Memoir, reflection and true stories, written by the people who lived them.",
    },
    featured: {
      bookId: "when-god-finds-a-man",
      eyebrow: "True story of the month",
      heading: "True stories,\ntold by those who lived them.",
    },
    subgenres: [
      { slug: "biography", name: "Biography", description: "Real-life stories of remarkable people and their achievements." },
      { slug: "autobiography", name: "Autobiography", description: "Life stories told by the people who experienced them." },
      { slug: "memoir", name: "Memoir", description: "Personal experiences, memories and reflections." },
      { slug: "history", name: "History", description: "Explore historical events, civilizations and important moments." },
      { slug: "politics", name: "Politics", description: "Ideas, leadership, political movements and global affairs." },
      { slug: "philosophy", name: "Philosophy", description: "Big questions about life, knowledge, ethics and existence." },
      { slug: "self-help", name: "Self-Help", description: "Practical guidance for personal growth and everyday life." },
      { slug: "business", name: "Business & Economics", description: "Entrepreneurship, leadership, finance and economic thinking." },
      { slug: "science", name: "Science & Nature", description: "Discoveries, scientific ideas and the natural world." },
      { slug: "travel", name: "Travel", description: "Travel experiences, destinations and cultural discoveries." },
      { slug: "religion", name: "Religion & Spirituality", description: "Faith, spiritual traditions and religious thought." },
      { slug: "psychology", name: "Psychology", description: "Human behavior, emotions, cognition and the mind." },
    ],
  },
  {
    slug: "children",
    name: "Children Books",
    description: "Picture books and first chapter books for young readers and the grown-ups who read with them.",
    hero: {
      eyebrow: "Browse by genre",
      title: "Children’s Books",
      description: "Picture books and first chapter books for young readers and the grown-ups who read with them.",
    },
    featured: {
      bookId: "classroom-teasing-is-mean",
      eyebrow: "Bedtime pick of the month",
      heading: "Little books.\nBig lessons.",
    },
    subgenres: [
      { slug: "picture-books", name: "Picture Books", description: "Illustrated stories that introduce young children to reading." },
      { slug: "bedtime-stories", name: "Bedtime Stories", description: "Gentle and imaginative tales for bedtime reading." },
      { slug: "fairy-tales", name: "Fairy Tales", description: "Magical stories filled with wonder and adventure." },
      { slug: "early-readers", name: "Early Readers", description: "Simple books designed to build early reading confidence." },
      { slug: "chapter-books", name: "Chapter Books", description: "Engaging stories for children developing independent reading skills." },
      { slug: "educational", name: "Educational Books", description: "Learning resources that make discovering new things enjoyable." },
      { slug: "activity-books", name: "Activity Books", description: "Puzzles, coloring, games and creative activities." },
      { slug: "young-adult", name: "Young Adult", description: "Coming-of-age stories for teenage readers." },
      { slug: "mythology-folklore", name: "Mythology & Folklore", description: "Legends, myths and traditional tales from around the world." },
    ],
  },
  {
    slug: "mystery-thriller",
    name: "Mystery & Thriller",
    description: "Secrets, ciphers and late-night page-turners.",
    hero: {
      eyebrow: "Browse by genre",
      title: "Mystery & Thriller",
      description: "Secrets, courtrooms and late-night page-turners you won’t want to put down.",
    },
    featured: {
      bookId: "willy-jones-paranormal-reporter",
      eyebrow: "Page-turner of the month",
      heading: "Every witness\nhas something to hide.",
    },
    subgenres: [
      { slug: "crime-fiction", name: "Crime Fiction", description: "Criminal investigations, dangerous secrets and complex cases." },
      { slug: "detective-fiction", name: "Detective Fiction", description: "Clever investigators solving puzzling mysteries." },
      { slug: "psychological-thriller", name: "Psychological Thriller", description: "Suspenseful stories exploring fear, secrets and the human mind." },
      { slug: "suspense", name: "Suspense", description: "Tension-filled stories where every moment matters." },
      { slug: "legal-thriller", name: "Legal Thriller", description: "Courtroom drama, criminal justice and legal battles." },
      { slug: "political-thriller", name: "Political Thriller", description: "Power struggles, conspiracies and political intrigue." },
      { slug: "historical-mystery", name: "Historical Mystery", description: "Mysteries set against fascinating historical backdrops." },
      { slug: "cozy-mystery", name: "Cozy Mystery", description: "Light-hearted mysteries featuring amateur sleuths and small communities." },
      { slug: "espionage", name: "Espionage & Spy Fiction", description: "Secret agents, intelligence operations and international intrigue." },
      { slug: "horror", name: "Horror", description: "Dark, unsettling stories designed to thrill and frighten." },
    ],
  },
  {
    slug: "poetry",
    name: "Poetry",
    description: "Ghazals, free verse and collections to read slowly.",
    hero: {
      eyebrow: "Browse by genre",
      title: "Poetry",
      description: "Collections to read slowly, aloud, and more than once.",
    },
    featured: {
      bookId: "my-sister-number-eight",
      eyebrow: "Collection of the month",
      heading: "Words to read\nslowly.",
    },
    subgenres: [
      { slug: "classic-poetry", name: "Classic Poetry", description: "Timeless poems from celebrated literary traditions." },
      { slug: "modern-poetry", name: "Modern Poetry", description: "Contemporary voices and fresh poetic expressions." },
      { slug: "romantic-poetry", name: "Romantic Poetry", description: "Poems exploring love, beauty and emotional connection." },
      { slug: "ghazals", name: "Ghazals", description: "Expressive poetry rooted in a rich literary tradition." },
      { slug: "free-verse", name: "Free Verse", description: "Poetry that embraces freedom of rhythm and structure." },
      { slug: "epic-poetry", name: "Epic Poetry", description: "Grand narrative poems of heroes, journeys and legends." },
      { slug: "spoken-word", name: "Spoken Word", description: "Performance-driven poetry written to be heard and experienced." },
      { slug: "nature-poetry", name: "Nature Poetry", description: "Poems inspired by landscapes, seasons and the natural world." },
      { slug: "poetry-anthologies", name: "Poetry Anthologies", description: "Collections bringing together multiple poets and voices." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Authors                                                             */
/* ------------------------------------------------------------------ */
export const AUTHORS = [
  {
    id: "donald-g-newman",
    name: "Donald G. Newman",
    photo: "/images/authors/donald-g-newman.webp",
    bio: "Donald G. Newman writes historical fiction that explores people living through periods of extraordinary change. His novels journey across centuries and continents, bringing together naval warfare, colonial Australia, the Second World War, Vietnam, and the political and social forces that shaped each era.",
    website: "https://donaldgnewman.com/",
  },
  {
    id: "kevin-lachausse",
    name: "Kevin Lachausse",
    photo: "/images/authors/kevin-lachausse.webp",
    bio: "Kevin Joseph Lachausse is a writer from Southeast Texas whose work focuses on psychological tension, atmosphere, and the emotional complexity of human nature. Before turning to fiction, he spent years working in ministry, cemeteries, and funeral service—experiences that gave him a unique perspective on grief, loss, and the quiet moments that shape people during life’s most difficult seasons.",
    website: "https://kjlfiction.com/",
  },
  { id: "capt-j-d-evanston", name: "Capt. J D Evanston", photo: "", bio: "", website: "" },
  { id: "kathy-consoli", name: "Kathy Consoli", photo: "", bio: "", website: "" },
  { id: "robert-matthews", name: "Robert Matthews", photo: "", bio: "", website: "" },
  { id: "jason-lashaun-robinson", name: "Jason LaShaun Robinson", photo: "", bio: "", website: "" },
  {
    id: "nancy-arlene-nelson",
    name: "Nancy Arlene Nelson",
    photo: "",
    bio: "I am 80 years old and published my first book. I hope not the only one but this one is a start. I am mom to 10 grown children and 2 angel babies. I didn't kill my teenagers so now I am also grandmother to 59 grands via DNA, marriage, adoption, and court orders and also same applies to my 61 great grandchildren (and still counting)",
    website: "",
  },
  { id: "clemenceau-alexis", name: "Clemenceau Alexis", photo: "", bio: "", website: "" },
  { id: "willie-johnson", name: "Willie Johnson", photo: "", bio: "", website: "" },
  { id: "nancy-evelyn-allen", name: "Nancy Evelyn Allen", photo: "", bio: "", website: "" },
  { id: "donte-lavender", name: "Donte Lavender", photo: "", bio: "", website: "" },
  { id: "heather-nalborczyk", name: "Heather Nalborczyk", photo: "", bio: "", website: "" },
  { id: "marcus-turner", name: "Marcus Turner", photo: "", bio: "", website: "" },
  {
    id: "gary-k-wallace",
    name: "Gary K. Wallace",
    photo: "/images/authors/gary-k-wallace.webp",
    bio: "I love writing. The wonder of creating stories started in the third grade. I wrote short plays and skits for my class and that's when the bug hit me and I have been writing ever since. After battling cancer, a traumatic marriage, and dealing with a demanding career, my writing got placed on hold. It took me forty years of chipping away at my first novel before it finally was publish, RENNAISSANCE MANN a science fiction adventure. ",
    website: "https://gkwallacebook.com/",
  },
  { id: "larry-washington", name: "Larry Washington", photo: "", bio: "", website: "" },
  {
    id: "john-fabrizio",
    name: "John Fabrizio",
    photo: "/images/authors/john-fabrizio.webp",
    bio: "Mr. Fabrizio is a Brooklyn native whose writing brings to life the heart and soul of the city. With a deep connection to his roots, John’s stories mix fiction with his own memories, offering a glimpse into the lives of those who lived, worked, and played in Brooklyn. His ability to tell stories that resonate with everyday people is what makes his writing stand out.",
    website: "https://johnfabriziobklynstories.com/",
  },
  {
    id: "hans-paladini",
    name: "Hans Paladini",
    photo: "/images/authors/hans-paladini.webp",
    bio: "Hans Paladini brings action, supernatural crime, dark humor, and unconventional heroes together across interconnected series designed to keep readers returning to their worlds.",
    website: "",
  },
];

/* ------------------------------------------------------------------ */
/* Books                                                               */
/* "genres" holds main genres and sub-genres together.                 */
/* ------------------------------------------------------------------ */
const BOOK_LIST = [
  {
    "id": "looking-for-love-a-unique-literary-voyage",
    "authorId": "capt-j-d-evanston",
    "title": "Looking for love: A unique literary voyage",
    "author": "Capt. J D Evanston",
    "cover": "/images/covers/looking-for-love-a-unique-literary-voyage.png",
    "genres": ["fiction", "romance", "literary-fiction"],
    "description": "At first glance, one is teasingly drawn into its deceptively simple appearance. Once inside, it's playful and sexy, amusing, intriguing, intellectually stimulating, and yet idealistically serious, all at the same time. It teases the imagination as it reveals the woman this old Pirate truly needs; and if found, what she receives in life as a result. NOTE- Memories seem to be magically triggered and replayed from vaults held tightly sealed within each reader's own heart. Part of its collective worth may be the personal connection one feels, and new insight or perspective one gathers, while absorbing it yet once more. Ultimately it illuminates every dark shadow deep within a man's heart; revealing what it means for man to truly love. An old Pirate's often questionable habits, dreams and desires, as well as his painful past...all laid bare upon the tropical white sand beach for all to see. May each reader be rewarded with sweet laughter, a fresh perspective of life and love, and a renewed sense of respect for all good things, living and otherwise. After all, we do share the same home-planet Earth-with its countless deep mysteries and majestic natural beauty ...just like Woman.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HPZ898TY" }],
    "price": "$4.00 (Kindle) / $12.00 (Paperback)",
    "isbn": "B0HPZ898TY",
    "printLength": "87 pages",
    "trim": "8.5 x 11 inches",
    "language": "English",
    "publicationDate": "October 31, 2026",
    "featured": false
  },
  {
    "id": "kason-the-kind-lion-prince",
    "authorId": "kathy-consoli",
    "title": "KASON: The Kind Lion Prince",
    "author": "Kathy Consoli",
    "cover": "/images/covers/kason-the-kind-lion-prince.png",
    "genres": ["children", "picture-books", "bedtime-stories"],
    "description": "KASON: THE KIND LION PRINCE — An Inspiring Children's Story About Kindness, Friendship, and Caring for Others. Meet Kason, a lovable young lion prince who believes that kindness can make the world a better place! In a magical jungle, Kason discovers that his animal friends are arguing, teasing one another, and struggling to share. With a kind heart and gentle words, he helps them understand the true meaning of kindness. Through heartwarming encounters with his jungle friends, Kason teaches children the importance of sharing, taking turns, helping others, respecting older people, using good manners, apologizing for mistakes, and welcoming those who feel left out. As the animals learn to treat one another with care and respect, they discover that even the smallest act of kindness can make someone feel loved and valued. KASON: THE KIND LION PRINCE is a delightful, beautifully illustrated children's story that encourages young readers to develop empathy, build friendships, and make thoughtful choices in their everyday lives. Perfect for: Young children learning about kindness and friendship; Parents and caregivers looking for meaningful bedtime stories; Teachers introducing kindness and social-emotional learning; Classroom reading and family storytime; Children learning sharing, respect, patience, and good manners. With charming animal characters and a magical jungle setting, Kathy Consoli delivers a heartwarming message that children can carry with them wherever they go.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HP4142RF" }],
    "price": "$8.99 (Kindle) / $14.95 (Paperback)",
    "isbn": "B0HP4142RF",
    "printLength": "58 pages",
    "trim": "8.5 x 8.5 inches",
    "language": "English",
    "publicationDate": "October 23, 2026",
    "featured": false
  },
  {
    "id": "auggies-boo-boo",
    "authorId": "kathy-consoli",
    "title": "AUGGIE'S BOO-BOO",
    "author": "Kathy Consoli",
    "cover": "/images/covers/auggies-boo-boo.png",
    "genres": ["children", "picture-books", "bedtime-stories"],
    "description": "Auggie's Boo-boo Song: A Heartwarming Story About Little Accidents, Big Hugs, and Being Brave. Everybody gets boo-boos! And sometimes, a little love is just what we need to feel better. Meet Auggie, a playful little boy who loves running and playing outside with his dog, Bruce. But when a fun-filled adventure takes an unexpected tumble, Auggie scrapes his knee and needs a little help from Mommy. With gentle hands, a warm hug, a loving kiss, and a colorful bandage, Mommy helps Auggie discover that even though boo-boos can hurt, they do get better. Together, they sing a cheerful, comforting song that reminds Auggie that he is brave, he is loved, and everything will be okay. Auggie's Boo-boo Song is a heartwarming picture book that helps young children navigate the little bumps and scrapes of childhood. Through playful storytelling, a memorable sing-along song, and the reassuring love of family, children learn that it's okay to cry, healing takes time, and every little accident can become another adventure. Perfect for toddlers and preschoolers, this sweet story is ideal for: Helping little ones feel less afraid of cuts, scrapes, and minor accidents; Encouraging emotional expression, resilience, and bravery; Sharing comforting moments between parents and children; Reading aloud at bedtime, during recovery from a little mishap, or anytime a child needs reassurance. With its gentle message and joyful song, Auggie's Boo-boo Song celebrates the healing power of love, the comfort of a parent's embrace, and the courage to get back up and play again. Because everybody gets boo-boos—and everybody deserves a hug.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HMHGHZ96" }],
    "price": "$5.99 (Kindle) / $14.95 (Paperback)",
    "isbn": "B0HMHGHZ96 (ASIN) / 9798182890632 (Paperback ISBN)",
    "printLength": "46 pages",
    "trim": "8.5 x 8.5 inches",
    "language": "English",
    "publicationDate": "October 9, 2026",
    "featured": false
  },
  {
    "id": "the-funeral-director",
    "authorId": "kevin-lachausse",
    "title": "THE FUNERAL DIRECTOR",
    "author": "Kevin Lachausse",
    "cover": "/images/covers/the-funeral-director.png",
    "genres": ["fiction", "horror", "suspense"],
    "description": "In the quiet town of Bracken Hollow, death has always been part of life. Harold Greaves, the town's respected funeral director, has spent years preparing the dead with calm precision and quiet routine. But when a body suddenly responds to his command, everything changes. What begins as an impossible accident soon becomes something far more dangerous. Harold discovers a strange connection between himself and the dead, one that allows him to control them through invisible threads of obedience. At first, the experiments seem manageable. Controlled. Predictable. But as the bodies begin to learn, adapt, and move beyond his intentions, fear spreads across the town like a living shadow. Fog-covered streets, unexplained movements, whispers in the dark, and figures standing where no living person should be—Bracken Hollow slowly descends into terror as the line between life and death begins to unravel. While the townspeople search for answers, Harold becomes consumed by the growing power in his hands, unaware that something else may also be watching from the darkness. The Funeral Director is a chilling supernatural horror novel filled with psychological tension, eerie atmosphere, and slow-building dread that explores control, fear, and the terrifying cost of awakening something that should have remained silent forever.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0H3FXBS3K" }],
    "price": "$2.99 (Kindle) / $16.99 (Paperback)",
    "isbn": "B0H3FXBS3K",
    "printLength": "145 pages",
    "trim": "6 x 9 inches",
    "language": "English",
    "publicationDate": "May 30, 2026",
    "featured": false
  },
  {
    "id": "the-fractured-dead",
    "authorId": "kevin-lachausse",
    "title": "The Fractured Dead: The Funeral Director Chronicles Book Two",
    "author": "Kevin Lachausse",
    "cover": "/images/covers/the-fractured-dead.png",
    "genres": ["fiction", "horror", "suspense"],
    "description": "THE FRACTURED DEAD. Bracken Hollow was only the beginning. Now, the horror is spreading beyond the town's borders, and the dead are becoming something far more terrifying: organized, intelligent, and increasingly impossible to control. Sheriff Tobias and a fragile coalition of survivors must unite against an evolving threat while fear and suspicion threaten to destroy them from within. Meanwhile, Harold Greaves, the funeral director behind the nightmare, discovers that what he unleashed has grown beyond his command. As the living fight to survive, one chilling truth emerges: the dead are learning, and their nightmare is only beginning.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HNV1P5FZ" }],
    "price": "$2.99 (Kindle) / $17.99 (Paperback) / $22.99 (Hardcover)",
    "isbn": "B0HNV1P5FZ (ASIN) / 979-8164288389 (ISBN-13)",
    "printLength": "124 pages",
    "trim": "6 x 9 inches",
    "language": "English",
    "publicationDate": "October 21, 2026",
    "featured": false
  },
  {
    "id": "my-sister-number-eight",
    "authorId": "robert-matthews",
    "title": "My Sister Number Eight",
    "author": "Robert Matthews",
    "cover": "/images/covers/my-sister-number-eight.png",
    "genres": ["poetry", "modern-poetry", "free-verse"],
    "description": "MY SISTER NUMBER EIGHT. In My Sister Number 8, Dr. Robert Matthews presents a deeply personal collection of poetry shaped by memory, struggle, love, loss, and the realities that often remain unspoken. Through poems such as \"Life's Silent Screams,\" \"Where Are You?,\" \"Free Labor,\" \"Take Aways,\" and \"Dear Lady,\" Matthews reflects on the moments that leave lasting marks on a life. He writes of the silent shock of devastating news, the loneliness of searching for someone who is no longer there, the enduring wounds of racial inequality and injustice, and the determination to stand firm when opportunities, dignity, and even one's voice seem to be taken away. Yet within these difficult truths are gratitude, remembrance, and strength. In tender reflections on the people who have shaped his life, Matthews recognizes the quiet acts of love and sacrifice that are sometimes understood only with time. Raw, reflective, and deeply human, My Sister Number 8 gives voice to the silent screams we carry, the memories we cannot change, and the strength we discover in continuing forward.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HPCSM3VM" }],
    "price": "$0.00 (Kindle Unlimited) / $7.99 (Kindle) / $12.99 (Paperback) / $19.99 (Hardcover)",
    "isbn": "B0HPCSM3VM (ASIN) / 979-8182942119 (ISBN-13)",
    "printLength": "50 pages",
    "trim": "6 x 9 inches",
    "language": "English",
    "publicationDate": "October 18, 2026",
    "featured": true
  },
  {
    "id": "bloodline-unbroken",
    "authorId": "jason-lashaun-robinson",
    "title": "Bloodline Unbroken: Legacy First. Labels Last.",
    "author": "Jason LaShaun Robinson",
    "cover": "/images/covers/bloodline-unbroken.png",
    "genres": ["non-fiction", "history"],
    "description": "Bloodline Unbroken: Legacy First. Labels Last. explores family history, ancestry, and identity in America. Jason LaShaun Robinson examines genealogy, family records, and historical documents. The book investigates how census labels and government policies shaped family identities. It explores Indigenous ancestry, tribal histories, kinship, and changing definitions of identity. Historical events, displacement, and racial reclassification policies provide important context. The research connects personal lineage with broader African American and Indigenous histories. Readers are encouraged to examine the evidence carefully when tracing their family roots. A research-centered exploration of legacy, historical memory, and the importance of preserving family history.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HNDWCR2D" }],
    "price": "$7.99 (Kindle) / $26.99 (Print)",
    "isbn": "B0HNDWCR2D",
    "printLength": "112 pages",
    "trim": "6.24 x 9.24 inches",
    "language": "English",
    "publicationDate": "October 17, 2026",
    "featured": false
  },
  {
    "id": "protege-of-the-sea-wolf",
    "authorId": "donald-g-newman",
    "title": "Protégè of the Sea Wolf",
    "author": "Donald G Newman",
    "cover": "/images/covers/protege-of-the-sea-wolf.png",
    "genres": ["novel", "historical-novels", "adventure-novels"],
    "description": "From a young midshipman learning the harsh realities of life at sea to an accomplished Royal Navy captain, James Christopher Alston Bristow's life is shaped by courage, discipline, ingenuity, and an extraordinary understanding of the sea. Beginning during the Revolutionary Wars, Bristow rises through the ranks of the Royal Navy, serving aboard ships including HMS Swallow, Proteus, and Magenta. Along the way, he faces enemy frigates, coastal fortifications, dangerous waters, captivity, and the relentless demands of naval warfare. His career takes him far beyond European waters. His adventures eventually lead him into the world of the Honourable East India Company, voyages to India and Australia, and encounters that test not only his skills as a sailor and commander but also his principles as a man. Inspired by the naval tradition of the age and influenced by legendary figures such as Thomas Cochrane, Lord Dundonald, Bristow develops his own approach to naval strategy and command. His story is one of ships, battles, exploration, loyalty, leadership, and survival across a rapidly changing world. PROTÉGÈ OF THE SEA WOLF is a sweeping historical naval adventure for readers who enjoy the age of sail, Royal Navy stories, maritime history, and action-filled historical fiction.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HKWYY839" }],
    "price": "$0.00 (Kindle Unlimited) / $1.99 (Kindle) / $18.99 (Paperback) / $26.99 (Hardcover)",
    "isbn": "B0HKWYY839",
    "printLength": "264 pages",
    "trim": "6 x 9 inches",
    "language": "English",
    "publicationDate": "September 24, 2026",
    "featured": false
  },
  {
    "id": "convict-son",
    "authorId": "donald-g-newman",
    "title": "Convict Son",
    "author": "Donald G Newman",
    "cover": "/images/covers/convict-son.png",
    "genres": ["novel", "historical-novels", "family-sagas"],
    "description": "In nineteenth-century England, nineteen-year-old John Bracken is struggling to survive after the death of his father leaves him and his mother facing poverty and homelessness. Determined to recover his father's shoemaking tools, John enters the workshop from which his family was evicted. What begins as an attempt to reclaim the means to support his mother leads to his arrest, conviction, and a seven-year sentence of hard labour. Transported from England to Western Australia aboard the Windsor, John faces prison hulks, harsh conditions, an unforgiving voyage, and the uncertainty of life in a distant colony. In Western Australia, however, John begins to discover that his skills, determination, literacy, and willingness to work may offer him a path toward a different future. From convict labor and road construction to farming, leatherwork, freedom, family, and business, his life becomes intertwined with the growth of a young Australian colony. CONVICT SON follows John's remarkable journey from poverty and imprisonment to freedom and citizenship, while tracing the family, relationships, challenges, and changing society that surround him across generations. A story of hardship, resilience, opportunity, family, and the making of a life in colonial Australia.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HKXZ5MRF" }],
    "price": "$1.99 (Kindle) / $16.99 (Paperback) / $24.99 (Hardcover)",
    "isbn": "B0HKXZ5MRF",
    "printLength": "285 pages",
    "trim": "6 x 9 inches",
    "language": "English",
    "publicationDate": "September 24, 2026",
    "featured": false
  },
  {
    "id": "pilot",
    "authorId": "donald-g-newman",
    "title": "PILOT",
    "author": "Donald G Newman",
    "cover": "/images/covers/pilot.png",
    "genres": ["novel", "historical-novels", "adventure-novels"],
    "description": "As Europe is plunged into the darkness of the Second World War, young men and women are forced to make choices that will define the rest of their lives. For Polish pilot Janós Hoffman, the destruction of his homeland changes everything. Determined to continue the fight against Nazi Germany, he joins the Allied war effort and begins a new journey with the Royal Air Force. His transition from fighter pilot to bomber pilot takes him into the dangerous world of long-range night operations, where courage, skill, and loyalty are tested on every mission. But the war is fought on more than one battlefield. Across occupied Europe, resistance movements struggle to survive while secret agents, refugees, and ordinary citizens risk everything to oppose the enemy. As Janós becomes increasingly connected to the Polish Government-in-Exile and clandestine operations, the distinction between military duty and espionage begins to disappear. From RAF bomber operations and dangerous low-level flights to secret missions supporting resistance fighters in occupied Europe, PILOT follows a generation caught between duty, loyalty, love, and survival. Set against the turbulent years of World War II, PILOT is a historical war novel combining aviation, espionage, resistance, and personal drama in a story of courage and sacrifice.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HLJJFNH9" }],
    "price": "$1.99 (Kindle) / $16.99 (Paperback) / $26.99 (Hardcover)",
    "isbn": "B0HLJJFNH9",
    "printLength": "355 pages",
    "trim": "6 x 9 inches",
    "language": "English",
    "publicationDate": "September 30, 2026",
    "featured": false
  },
  {
    "id": "living-with-deuteronomy",
    "authorId": "donald-g-newman",
    "title": "Living With Deuteronomy",
    "author": "Donald G Newman",
    "cover": "/images/covers/living-with-deuteronomy.png",
    "genres": ["novel", "literary-novels", "psychological-novels"],
    "description": "What happens when the principles you have lived by for most of your life collide with love, loss, family, and the complicated choices of the human heart? Peter Walker has spent his life trying to live according to a moral code shaped by faith, responsibility, and the teachings of Deuteronomy. But life does not always offer simple choices. From his early years and a devastating lost love to his experiences in Vietnam, Peter carries memories and convictions that continue to influence the man he becomes. His journey takes him through education, work, international experiences, family responsibilities, and a demanding career where leadership and compassion become equally important. Years later, the past returns in unexpected ways. Old relationships, unresolved emotions, family secrets, and questions of forgiveness force Peter and those closest to him to confront choices they thought were long behind them. At the heart of the story is a difficult question: Can a person remain faithful to deeply held principles while also accepting the complicated realities of love, forgiveness, and human imperfection? Living With Deuteronomy is a character-driven novel about love, faith, family, morality, regret, forgiveness, and the lifelong consequences of the choices we make.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HLJ6CWRL" }],
    "price": "$1.99 (Kindle) / $16.99 (List)",
    "isbn": "B0HLJ6CWRL",
    "printLength": "359 pages",
    "trim": "6 x 9 inches",
    "language": "English",
    "publicationDate": "September 30, 2026",
    "featured": false
  },
  {
    "id": "mama-said-thered-be-stories-like-this",
    "authorId": "nancy-arlene-nelson",
    "title": "MAMA SAID THERE'D BE STORIES LIKE THIS: From One to Many: A Family Unfolds",
    "author": "Nancy Arlene Nelson",
    "cover": "/images/covers/mama-said-thered-be-stories-like-this.png",
    "genres": ["non-fiction", "memoir"],
    "description": "From One to Many: A Family Unfolds is a heartfelt and often hilarious collection of memories from a lifetime of motherhood, marriage, family, loss, laughter, and love. Nancy Nelson never set out to write a traditional memoir. Instead, she gathered the stories that stayed with her—the unexpected moments, family adventures, childhood memories, challenges, celebrations, and unforgettable experiences that shaped generations of her family. From the miracle of becoming a mother against the odds to raising a large family, welcoming bonus children, grieving two angel babies, watching children grow into parents, and celebrating grandchildren and great-grandchildren, Nancy shares the moments that made her family what it is today. With warmth, humor, honesty, and tenderness, these stories capture the beautiful chaos of family life. Some moments will make you laugh. Others may bring tears. Many will remind you of stories from your own family. This is more than a collection of memories. It is a celebration of motherhood, family bonds, resilience, faith, and the love that continues from one generation to the next. From One to Many: A Family Unfolds is for anyone who believes that the most meaningful stories are often found in the ordinary moments we share with the people we love.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HM7JKX2B" }],
    "price": "$0.00 (Kindle Unlimited) / $6.99 (Kindle) / $14.99 (Paperback)",
    "isbn": "B0HM7JKX2B (ASIN) / 979-8160645971 (ISBN-13)",
    "printLength": "159 pages",
    "trim": "6 x 9 inches",
    "language": "English",
    "publicationDate": "October 7, 2026",
    "featured": false
  },
  {
    "id": "when-god-finds-a-man",
    "authorId": "clemenceau-alexis",
    "title": "WHEN GOD FINDS A MAN: 50 Years of Pastoral Faithfulness",
    "author": "Clemenceau Alexis",
    "cover": "/images/covers/when-god-finds-a-man.png",
    "genres": ["non-fiction", "biography", "religion"],
    "description": "Discover the inspiring story of Bishop Joseph Noncent and a ministry built through faith, prayer, sacrifice, and perseverance. Through fifty years of pastoral service, this book explores the humble beginnings of a church, the challenges of spiritual leadership, the sacrifices behind ministry, and the lives transformed through faith. More than a biography, this is a testimony of dedication, resilience, and the lasting impact of a life committed to God. Whether you are a pastor, church leader, ministry worker, or Christian seeking spiritual encouragement, this story offers valuable lessons on faithfulness, leadership, and building a legacy that continues across generations. A story of faith. A legacy of service. Fifty years of faithfulness.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HNS9BDHS" }],
    "price": "$0.00 (Kindle Unlimited) / $9.99 (Kindle) / $16.99 (Paperback) / $28.99 (Hardcover)",
    "isbn": "B0HNS9BDHS (ASIN) / 979-8162601371 (ISBN-13)",
    "printLength": "168 pages",
    "trim": "6 x 9 inches",
    "language": "English",
    "publicationDate": "October 15, 2026",
    "featured": false
  },
  {
    "id": "through-the-storms",
    "authorId": "willie-johnson",
    "title": "Through the Storms: A Witness to God's Miracles",
    "author": "Willie Johnson",
    "cover": "/images/covers/through-the-storms.png",
    "genres": ["non-fiction", "memoir", "religion"],
    "description": "What happens when life's storms leave you feeling forgotten, broken, and uncertain about the future? In Through the Storms: A Witness to God's Miracles, Willie Johnson shares a deeply personal journey of hardship, survival, faith, and spiritual transformation. Through painful experiences, unexpected challenges, and moments when hope seemed distant, this testimony explores the enduring power of faith and the quiet ways God can bring strength into our lives. Discover a message of perseverance, surrender, forgiveness, and renewal. Sometimes miracles arrive through dramatic changes. Other times, they appear in the courage to face another day, the kindness of an unexpected friend, or the peace that comes when circumstances remain uncertain. This book is a reminder that difficult seasons do not have to define your future and that faith can remain meaningful even when answers seem far away. Inside this book, you will explore: Finding faith during life's most difficult storms; Facing doubt, fear, and emotional struggles; Recognizing hope in ordinary moments; Learning to let go and grow through adversity; Discovering strength, purpose, and spiritual renewal. If you are searching for encouragement during a difficult season, a personal Christian testimony, or a reminder that hope can endure through hardship, this book invites you to reflect on your own journey and the miracles that may be unfolding along the way.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HQ2MS4XM" }],
    "price": "$4.99 (Kindle) / $14.99 (Paperback) / $21.99 (Hardcover)",
    "isbn": "B0HQ2MS4XM",
    "printLength": "108 Pages",
    "trim": "6 x 9 inches",
    "language": "English",
    "publicationDate": "November 1, 2026",
    "featured": false
  },
  {
    "id": "echoes-of-a-mothers-voice",
    "authorId": "nancy-evelyn-allen",
    "title": "Echoes of a Mother's Voice: What Makes Her Act that Way?",
    "author": "Nancy Evelyn Allen",
    "cover": "/images/covers/echoes-of-a-mothers-voice.png",
    "genres": ["non-fiction", "memoir", "religion"],
    "description": "In Echoes of a Mother's Voice, Nancy Evelyn Allen shares the story of her mother, Eliza, and the complicated, loving, and sometimes difficult relationship they shared throughout their lives. Told through memories from her mother's childhood through her later years, Nancy looks back at the people, experiences, family relationships, and circumstances that helped shape her mother into the woman she became. Along the way, she also reflects on her own life and the ways her relationship with her mother affected her. As her mother grows older, Nancy takes on the responsibility of caring for her. Eventually, she and her husband bring her mother into their home, creating a space where she can live safely while remaining as independent as possible. The experience brings challenges, difficult decisions, moments of frustration, and many opportunities for love and understanding. Nancy openly shares both the joyful and painful memories, including family struggles, loss, caregiving, grief, and the questions that remain after a loved one is gone. Her Christian faith is an important part of her journey as she learns to honor her mother, forgive, accept what she cannot change, and trust God with the things beyond her control. This is a story about a mother and daughter, but it is also a story about family, aging, memories, faith, and love. Through her mother's story and her own reflections, Nancy invites readers to consider the experiences that shape us and the ways we care for the people we love. Echoes of a Mother's Voice is a heartfelt memoir for anyone who has experienced the joys and difficulties of family relationships, cared for an aging parent, or faced the loss of someone they love.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HDHZ3MB7" }],
    "price": "$0.00 (Kindle Unlimited) / $8.99 (Kindle)",
    "isbn": "B0HDHZ3MB7",
    "printLength": "276 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "September 2, 2026",
    "featured": false
  },
  {
    "id": "classroom-teasing-is-mean",
    "authorId": "donte-lavender",
    "title": "CLASSROOM TEASING IS MEAN",
    "author": "Donte Lavender",
    "cover": "/images/covers/classroom-teasing-is-mean.png",
    "genres": ["children", "picture-books", "educational"],
    "description": "Words can hurt, but kindness can make things better. Classroom Teasing Is Mean is a meaningful children's story that teaches young readers about the importance of kindness, empathy, and treating others with respect. Tyler likes to tease his classmates, making fun of Dennis's glasses and criticizing Kamyl's drawing. But when his classmates stop talking and playing with him, Tyler begins to experience the sadness that hurtful behavior can cause. With guidance from his teacher, Ms. Kayla, Tyler learns that teasing can hurt other people's feelings. After experiencing teasing himself, he realizes his mistake, apologizes to his classmates, and works to rebuild their friendship.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HK2HK6F2" }],
    "price": "$6.99 (Kindle) / $12.99 (Paperback)",
    "isbn": "B0HK2HK6F2 (ASIN) / 979-8182739641 (ISBN-13)",
    "printLength": "18 pages",
    "trim": "8.5 × 8.5 inches",
    "language": "English",
    "publicationDate": "September 3, 2026",
    "featured": true
  },
  {
    "id": "mind-over-matters-bc",
    "authorId": "heather-nalborczyk",
    "title": "Mind Over Matters BC",
    "author": "Heather Nalborczyk",
    "cover": "/images/covers/mind-over-matters-bc.png",
    "genres": ["non-fiction", "self-help", "psychology"],
    "description": "A 12-Week Reentry & Life Transformation Curriculum provides practical guidance for rebuilding life after incarceration or difficult circumstances. This structured curriculum focuses on personal growth, accountability, confidence, and positive decision-making. Topics include identity, communication, healthy relationships, mental wellness, employment, finances, housing, and community support. Participants explore recovery, legal responsibilities, goal setting, purpose, and strategies for avoiding old patterns. Lessons, reflection questions, worksheets, activities, and planning exercises encourage meaningful personal development. The curriculum promotes faith, hope, responsibility, and the belief that the past does not have to define the future. It can support individuals, mentors, counselors, facilitators, reentry programs, and community organizations. Designed for educational and personal-development purposes, it provides a practical foundation for stability, independence, and positive change.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HL1VST2F" }],
    "price": "$19.99 (Kindle) / $39.99 (Paperback) / $49.99 (Hardcover)",
    "isbn": "B0HL1VST2F",
    "printLength": "234 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "September 25, 2026",
    "featured": false
  },
  {
    "id": "the-dixie-gatsby",
    "authorId": "marcus-turner",
    "title": "The Dixie Gatsby: A Novel",
    "author": "Marcus Turner",
    "cover": "/images/covers/the-dixie-gatsby.png",
    "genres": ["novel", "social-novels", "crime-fiction"],
    "description": "Born into poverty outside New Orleans, Antonio Francois grows up knowing hunger, hardship, and the helplessness of watching his family struggle. Determined to create a different life, he begins with small acts of survival that gradually lead him into the dangerous world of money, influence, and organized crime. As Antonio rises through the streets of New Orleans, the boy who once had nothing becomes the formidable head of the Francois Syndicate. With legitimate businesses masking an expanding criminal empire, his name commands loyalty, respect, and fear. But his growing power also puts him on a collision course with Chief Edmund Beaumont, a man determined to challenge Antonio's grip on the city.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HKY1Y65P" }],
    "price": "$9.99 (Kindle)",
    "isbn": "B0HKY1Y65P (ASIN) / 979-8182772136 (ISBN-13)",
    "printLength": "868 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "September 12, 2026",
    "featured": true
  },
  {
    "id": "renaissance-mann",
    "authorId": "gary-k-wallace",
    "title": "RENAISSANCE MANN",
    "author": "Gary K. Wallace",
    "cover": "/images/covers/renaissance-mann.png",
    "genres": ["fiction", "science-fiction", "adventure"],
    "description": "RENAISSANCE MANN. By Gary K. Wallace. In a future where technology reshapes humanity, Phil, a man reborn from the ashes of a devastating accident, is thrust into a journey beyond his wildest imagination. Reconstructed by a mysterious alien, he finds himself a hybrid, neither fully human nor entirely machine. As his memories collide with his new body, Phil faces an identity crisis unlike any other. But the real question isn't just about who he is—it's about where he's headed. On a journey through deep space, accompanied by Nicki, an enigmatic alien who sees him both as a project and a companion, Phil discovers the dark secrets behind his resurrection. An ancient race struggles to survive, and he may be their last hope. But can he trust the very being that created him? RENAISSANCE MANN blends elements of science fiction, romance, and existential exploration, drawing readers into a world where humanity, alien technology, and love collide, redefining the future.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0G275GB21" }],
    "price": "$6.99 (Kindle) / $24.95 (Paperback) / $30.90 (Hardcover)",
    "isbn": "B0G275GB21 (ASIN) / 978-1966587576 (ISBN-13)",
    "printLength": "520 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "November 7, 2025",
    "featured": false
  },
  {
    "id": "mr-territaff-dark-matters",
    "authorId": "gary-k-wallace",
    "title": "MR. TERRITAFF: DARK MATTERS",
    "author": "Gary K. Wallace",
    "cover": "/images/covers/mr-territaff-dark-matters.png",
    "genres": ["mystery-thriller", "fiction", "science-fiction", "crime-fiction"],
    "description": "When a brutal murder exposes traces of an impossible energy, Territaff—an ex-operative with secrets not entirely human—returns to Earth on a mission that will blur the line between science and the supernatural. Haunted by guilt and hunted by forces beyond comprehension, Territaff must uncover who—or what—is behind the rising wave of negative-energy killings. From the neon haze of South Beach to the shadow of the moon, he faces ruthless alien adversaries and a military conspiracy that could doom two worlds. But when he crosses paths with Kathy, a young empath drawn into his orbit, the battle becomes more than survival—it becomes a test of humanity itself. Together, they must confront a darkness older than the stars and more dangerous than war. A cinematic fusion of science fiction, metaphysical intrigue, and human emotion, MR. TERRITAFF: DARK MATTERS launches readers into a universe where energy, consciousness, and destiny collide.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0G26GBL55" }],
    "price": "$6.99 (Kindle) / $25.99 (Print List)",
    "isbn": "B0G26GBL55 (ASIN) / 978-1966587545 (ISBN-13)",
    "printLength": "696 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "November 12, 2025",
    "featured": false
  },
  {
    "id": "what-men-dont-like-about-women",
    "authorId": "larry-washington",
    "title": "WHAT MEN DON'T LIKE ABOUT WOMEN",
    "author": "Larry Washington",
    "cover": "/images/covers/what-men-dont-like-about-women.png",
    "genres": ["non-fiction", "politics", "psychology"],
    "description": "\"What men don't like about women\" snatches the covers off the bed of sexism, misogyny and femicide. The author learned from women in the genre of \"intimate partner violence\" about their oppression. He recognized he made a Faustian deal for \"power and control\" (Pence, 1981) of women and it wasn't worth it. Washington's expository narrative describes how cultures have pitted men and women against each other, while profiting off the oppression of women by men; the financiers profit off the conflict of war. The ruling classes introduce sexism the way a pimp introduces a woman to sex trafficking. Carnival Core theme – the ruling classes, merchant class, theology, and political classes are using the made-up myth that men and women can't get along and can barely tolerate each other and then profit off the misery they put in place.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HG3P8F33" }],
    "price": "$4.99 (Kindle) / $9.99 (Paperback) / $19.99 (Hardcover)",
    "isbn": "B0HG3P8F33",
    "printLength": "132 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "August 21, 2026",
    "featured": false
  },
  {
    "id": "in-the-shadow-of-the-el",
    "authorId": "john-fabrizio",
    "title": "In the Shadow of the El: Images of a Brooklyn Childhood",
    "author": "John Fabrizio",
    "cover": "/images/covers/in-the-shadow-of-the-el.png",
    "genres": ["novel", "literary-novels"],
    "description": "Like a magnetic force, memories of our childhood pull at our emotions, drawing us to days gone by. I traveled back to those days, to my old neighborhood, and found the toy box Ma had saved. Inside, I discovered my lost Eden—traces of the corner candy store . . . the beautiful little girl with marble brown eyes . . . the big ball game in the park . . . Come back for a while to the Brooklyn of the fifties and sixties. Slurp lemon ices, pry open Johnny pumps on sultry nights, and rub up new spaldeens. Come imagine and grow up with me again!",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0GZSB4B4S" }],
    "price": "$9.99 (Kindle) / $23.99 (Print List)",
    "isbn": "B0GZSB4B4S",
    "printLength": "291 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "May 7, 2026",
    "featured": false
  },
  {
    "id": "daywalker-vampire-princess-book-1-genesis",
    "authorId": "hans-paladini",
    "title": "Day Walker Vampire Princess: Book 1: Genesis",
    "author": "Hans Paladini",
    "cover": "/images/covers/daywalker-vampire-princess-book-1-genesis.png",
    "genres": ["fiction", "fantasy", "adventure"],
    "description": "She was only days away from completing her private schooling when her world was violently rewritten. Turned into a vampire against her will, she became something extraordinarily rare: a daywalker, capable of moving freely beneath the sun. Taken by a covert organization known as the Order, she was trained to become their ideal operative: assassin, law enforcer, and supernatural guardian. Stripped of her old life and reshaped into a weapon, she now carries a name spoken with equal parts fear and respect: Princess. Assigned to Metro City's notorious District 7, Princess patrols a territory where danger hides in every alley. Her missions pull her into a world of ruthless monsters, hidden agendas, unexpected alliances, and temptations that challenge her limits. Filled with action, dark humor, sensual tension, and surprising twists, Daywalker Vampire Princess delivers a fast-paced adventure where the risks are high, the shadows are alive, and anything can happen.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0GHPCYP3Y" }],
    "price": "$2.99 (Kindle) / $16.50 (Print List)",
    "isbn": "B0GHPCYP3Y",
    "printLength": "132 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "January 19, 2026",
    "featured": true
  },
  {
    "id": "daywalker-vampire-princess-book-2-confessions-of-a-sinner",
    "authorId": "hans-paladini",
    "title": "Daywalker Vampire Princess Book 2: Confessions of a Sinner",
    "author": "Hans Paladini",
    "cover": "/images/covers/daywalker-vampire-princess-book-2-confessions-of-a-sinner.png",
    "genres": ["fiction", "fantasy", "adventure"],
    "description": "Second in a series about a young lady turned into a vampire against her will. But she isn't like all the rest of the vampires. She was turned by a rare day walking vampire unknown to her. She is taken in by a law enforcement organization known as the Order. They are responsible for vampire crimes in a dirty place called Metro City. The Daywalker known by a few names, code-named Princess after her training as an assassin, hunter, vampire police officer, is assigned District 7 — one of the worst in the city. These are her stories and the stories of her compatriots in a struggle between good and evil.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0F1XHQY2K" }],
    "price": "$3.99 (Kindle) / $26.99 (List)",
    "isbn": "B0F1XHQY2K (ASIN) / 978-1665794152 (ISBN-13)",
    "printLength": "171 pages",
    "trim": "8.5 × 11 inches",
    "language": "English",
    "publicationDate": "March 30, 2026",
    "featured": false
  },
  {
    "id": "daywalker-vampire-princess-book-3-one-way-ticket-to-hel",
    "authorId": "hans-paladini",
    "title": "Daywalker Vampire Princess Book 3: One Way Ticket to Hel",
    "author": "Hans Paladini",
    "cover": "/images/covers/daywalker-vampire-princess-book-3-one-way-ticket-to-hel.png",
    "genres": ["fiction", "fantasy", "adventure"],
    "description": "Agent Princess, known as Holly, is a daywalking enforcer for the Order—Metro City's supernatural police. After the violent Blood Brothers gang puts a deadly bounty on her head, her mission for justice becomes a personal crusade of revenge. Forced onto a high-stakes transport packed with the city's most dangerous vampires, Holly finds herself trapped at 30,000 feet with enemies on all sides. Teaming with the sharp and relentless Officer Ivy Powers, she must survive the flight, unmask a conspiracy, and face the hell waiting at the landing strip. One-Way Ticket to Hell is a relentless urban fantasy thriller where loyalty is tested, secrets bleed, and the only way out is through.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HFYR66R2" }],
    "price": "$4.99 (Kindle)",
    "isbn": "B0HFYR66R2 (ASIN) / 979-8295791833 (ISBN-13)",
    "printLength": "304 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "April 28, 2026",
    "featured": false
  },
  {
    "id": "daywalker-vampire-princess-book-4-purgatory",
    "authorId": "hans-paladini",
    "title": "Daywalker Vampire Princess Book 4: Purgatory",
    "author": "Hans Paladini",
    "cover": "/images/covers/daywalker-vampire-princess-book-4-purgatory.png",
    "genres": ["fiction", "fantasy", "adventure"],
    "description": "This is Book 4 in the series Daywalker Vampire Princess. At this moment, Agent Princess is tormented by her master and then flees out into the countryside around paranormal Metro City. Because of her past actions she is pursued by the feared vampire gang known as the Blood Brothers. She will make alliances and find erotic experiences in the country as well as kills. She will make her way to a place called Purgatory for one hit that will start the rebellion and bring the evil gang to a bloody end. A fast-paced erotic fantasy story where around every corner is more trouble and only Agent Princess knows how to handle it in her special way.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0H5SJHNB8" }],
    "price": "$3.99 (Kindle) / $26.99 (List)",
    "isbn": "B0H5SJHNB8 (ASIN) / 978-1665797849 (ISBN-13)",
    "printLength": "172 pages",
    "trim": "8.5 × 11 inches",
    "language": "English",
    "publicationDate": "June 26, 2026",
    "featured": false
  },
  {
    "id": "willy-jones-paranormal-reporter",
    "authorId": "hans-paladini",
    "title": "Willy Jones Paranormal Reporter",
    "author": "Hans Paladini",
    "cover": "/images/covers/willy-jones-paranormal-reporter.png",
    "genres": ["mystery-thriller", "crime-fiction", "detective-fiction"],
    "description": "Willy Jones knows crime. Twenty years on the beat for the Metro City Metropolitan, he's seen it all: murders, kidnappings, gangland executions. But when a bloody bank robbery leads him to a mysterious girl with glowing blue eyes who walks past police tape like she owns the city, Willy's world flips upside down. She calls herself Princess. She's a vampire, and she's on the right side of the law. From bloodsuckers and mummies to dark witches and werewolves, Willy dives headfirst into a hidden Metro City where monsters are real, the cops don't believe a word, and one sarcastic, leather-clad vampire might be his only way out alive. Trench coats, pork pie hats, and the supernatural underground—this is noir with fangs.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0H2NVWHGZ" }],
    "price": "$2.99 (Kindle) / $15.99 (List)",
    "isbn": "B0H2NVWHGZ",
    "printLength": "193 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "May 23, 2026",
    "featured": true
  },
  {
    "id": "willy-jones-paranormal-reporter-book-2-the-inquisitor",
    "authorId": "hans-paladini",
    "title": "Willy Jones Paranormal Reporter: Book 2 - The Inquisitor",
    "author": "Hans Paladini",
    "cover": "/images/covers/willy-jones-paranormal-reporter-book-2-the-inquisitor.png",
    "genres": ["fiction", "fantasy", "crime-fiction"],
    "description": "Metro City is no stranger to strange events, but this time, something far more sinister is stalking its streets. When a series of brutal murders leaves victims carved apart and mysterious messages written in blood, veteran reporter Willy Jones senses there is more to the story than an ordinary serial killer. As the body count rises, clues point toward an ancient evil connected to forgotten legends, lost souls, and a terrifying figure known only as The Inquisitor. Determined to uncover the truth, Willy follows a trail of supernatural mysteries through dark alleys, abandoned cemeteries, occult bookstores, and the hidden world that exists alongside everyday life. Along the way, he is joined by allies both human and supernatural, including the enigmatic daywalking vampire known as Princess. As danger closes in and the line between myth and reality disappears, Willy must confront forces far beyond anything the police can understand. The deeper he digs, the more he discovers that some monsters are real—and some are far older than anyone imagined. Filled with suspense, paranormal intrigue, dark humor, and unforgettable characters, The Inquisitor is a thrilling adventure for readers who enjoy supernatural mysteries and urban fantasy.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0H738VR58" }],
    "price": "$4.99 (Kindle) / $19.99 (List)",
    "isbn": "B0H738VR58 (ASIN) / 979-8240989605 (ISBN-13)",
    "printLength": "190 pages",
    "trim": "6 × 9 inches",
    "language": "English",
    "publicationDate": "June 29, 2026",
    "featured": false
  },
  {
    "id": "willy-jones-paranormal-reporter-book-3-terror-in-paradise",
    "authorId": "hans-paladini",
    "title": "Willy Jones Paranormal Reporter Book 3: Terror in Paradise",
    "author": "Hans Paladini",
    "cover": "/images/covers/willy-jones-paranormal-reporter-book-3-terror-in-paradise.png",
    "genres": ["fiction", "fantasy", "horror"],
    "description": "This is Book 3 in the series where the character Willy Jones takes a forced vacation on a tropical island. He thinks it will be fun in the sun with drinks and bikini babies galore. But after a taste of the resort he stumbles upon the hidden secrets that terrorize this tropical paradise. From bikini-clad vampires to zombies, the story is hard and fast—ending up where it started from in dirty, rainy Metro City.",
    "buyLinks": [{ "label": "Amazon", "url": "https://www.amazon.com/dp/B0HHG6WR9F" }],
    "price": "$4.99 (Kindle) / $23.99 (List)",
    "isbn": "B0HHG6WR9F (ASIN) / 978-1778839122 (ISBN-13)",
    "printLength": "216 pages",
    "trim": "8.5 × 8.5 inches",
    "language": "English",
    "publicationDate": "August 31, 2026",
    "featured": false
  },
  {
    "id": "daywalker-vampire-princess-picture-book",
    "authorId": "hans-paladini",
    "title": "Daywalker Vampire Princess Picture Book: Picture book to accompany books 1-3 in the series",
    "author": "Hans Paladini",
    "cover": "/images/covers/daywalker-vampire-princess-picture-book.png",
    "genres": ["fiction", "fantasy"],
    "description": "This book is a collection of 50 AI art pictures that accompany the Daywalker Vampire Princess series books 1-3. It gives the readers of the series more graphic art than what is in the books. It might also entice readers to read the books after enjoying the art from the storyline.",
    "buyLinks": [{ "label": "Amazon", "url": "https://a.co/d/03HRtv3F" }],
    "price": "$3.99 (Kindle) / $25.45 (Paperback) / $30.99 (Hardcover)",
    "isbn": "978-1665793919 (ISBN-13) / 1665793910 (ISBN-10)",
    "printLength": "52 pages",
    "trim": "8.5 × 11 inches",
    "language": "English",
    "publicationDate": "May 8, 2026",
    "featured": false
  }
];

/* ------------------------------------------------------------------ */
/* Sub-genres in one flat list: { slug, name, description, genre }     */
/* ------------------------------------------------------------------ */
export const SUBGENRES = GENRES.flatMap((g) => (g.subgenres ?? []).map((s) => ({ ...s, genre: g.slug })));

const GENRE_BY_SLUG = new Map(GENRES.map((g) => [g.slug, g]));
const SUB_BY_SLUG = new Map(SUBGENRES.map((s) => [s.slug, s]));

const cleanName = (name = "") => name.replace(/\s+Books$/i, "");

// Buttons on genre pages unless a genre sets its own in hero
const DEFAULT_HERO_ACTIONS = {
  primaryAction: { label: "Submit your book", to: "/submit" },
  secondaryAction: { label: "See new books", to: "/new-books" },
};

// Sorts a book's "genres" into main genres and sub-genres
function splitGenres(list = [], bookId) {
  const genres = [];
  const subgenres = [];
  for (const slug of list) {
    if (GENRE_BY_SLUG.has(slug)) {
      if (!genres.includes(slug)) genres.push(slug);
    } else if (SUB_BY_SLUG.has(slug)) {
      if (!subgenres.includes(slug)) subgenres.push(slug);
      const parent = SUB_BY_SLUG.get(slug).genre;
      if (!genres.includes(parent)) genres.push(parent);
    } else if (import.meta.env?.DEV) {
      console.warn(`books.js: "${bookId}" has unknown genre "${slug}" — check the spelling`);
    }
  }
  return { genres, subgenres };
}

/* ------------------------------------------------------------------ */
/* Final export: books with author name, genres and sub-genres         */
/* ------------------------------------------------------------------ */
export const BOOKS = BOOK_LIST.map((book) => ({
  ...book,
  authorName: AUTHORS.find((a) => a.id === book.authorId)?.name?.trim() ?? "",
  ...splitGenres(book.genres, book.id),
}));

/* ------------------------------------------------------------------ */
/* Links                                                               */
/* ------------------------------------------------------------------ */
export const genrePath = (genreSlug) => `/${genreSlug}`;
export const subgenrePath = (genreSlug, subSlug) => `/${genreSlug}/${subSlug}`;
export const bookPath = (bookOrId) => `/book/${typeof bookOrId === "string" ? bookOrId : bookOrId.id}`;
export const authorPath = (authorOrId) => `/authors/${typeof authorOrId === "string" ? authorOrId : authorOrId.id}`;

/* ------------------------------------------------------------------ */
/* Books, authors, genres                                              */
/* ------------------------------------------------------------------ */

// Last books in the list first (the most recently added)
export const getNewBooks = (limit = 10) => [...BOOKS].reverse().slice(0, limit);

// Books marked featured: true. Falls back to the first books if none are marked.
export const getStaffPicks = (limit = 5) => {
  const picks = BOOKS.filter((b) => b.featured);
  return (picks.length ? picks : BOOKS).slice(0, limit);
};

export const getBook = (id) => BOOKS.find((b) => b.id === id);
export const getAuthor = (id) => AUTHORS.find((a) => a.id === id);
export const getBooksByAuthor = (id) => BOOKS.filter((b) => b.authorId === id);

export const getGenre = (slug) => GENRE_BY_SLUG.get(slug);
export const getGenreName = (slug) => cleanName(GENRE_BY_SLUG.get(slug)?.name ?? SUB_BY_SLUG.get(slug)?.name ?? slug);

// "fantasy" → { slug, name, description, genre: "fiction" }
export const getSubgenre = (slug) => SUB_BY_SLUG.get(slug);

// Books in a main genre, in list order
export const getBooksByGenre = (slug, limit = Infinity) =>
  BOOKS.filter((b) => b.genres.includes(slug)).slice(0, limit);

// Books in a sub-genre, in list order
export const getBooksBySubgenre = (slug, limit = Infinity) =>
  BOOKS.filter((b) => b.subgenres.includes(slug)).slice(0, limit);

// Sub-genres of one genre with their book counts.
// includeEmpty: false → only sub-genres that have books (good for menus and filters)
export const getSubgenresWithBooks = (genreSlug, { includeEmpty = false } = {}) =>
  (GENRE_BY_SLUG.get(genreSlug)?.subgenres ?? [])
    .map((s) => ({
      ...s,
      genre: genreSlug,
      path: subgenrePath(genreSlug, s.slug),
      count: getBooksBySubgenre(s.slug).length,
    }))
    .filter((s) => includeEmpty || s.count > 0);

/* ------------------------------------------------------------------ */
/* Mega menu                                                           */
/* ------------------------------------------------------------------ */
/**
 * getMegaMenu() → one entry per main genre:
 * {
 *   slug, name, description, path, count,
 *   subgenres: [{ slug, name, path, count }],   // only ones with books
 *   featuredBook: { id, title, cover, authorName, path } | null
 * }
 * includeEmpty: true also lists genres / sub-genres that have no books yet.
 */
export const getMegaMenu = ({ includeEmpty = false, subgenreLimit = Infinity } = {}) =>
  GENRES.map((g) => {
    const books = getBooksByGenre(g.slug);
    const pick = books.find((b) => b.featured) ?? books[0];
    return {
      slug: g.slug,
      name: cleanName(g.name),
      description: g.description,
      path: genrePath(g.slug),
      count: books.length,
      subgenres: getSubgenresWithBooks(g.slug, { includeEmpty })
        .slice(0, subgenreLimit)
        .map(({ slug, name, path, count }) => ({ slug, name, path, count })),
      featuredBook: pick
        ? { id: pick.id, title: pick.title, cover: pick.cover, authorName: pick.authorName, path: bookPath(pick) }
        : null,
    };
  }).filter((g) => includeEmpty || g.count > 0);

/* ------------------------------------------------------------------ */
/* Page data for genre and sub-genre pages                             */
/* ------------------------------------------------------------------ */
export const NEW_BOOKS_PAGE = {
  slug: "new-books",
  hero: {
    eyebrow: "Fresh off the press",
    title: "New Books",
    description: "The latest titles added to our shelves by independent authors, newest first.",
    primaryAction: { label: "Submit your book", to: "/submit" },
    secondaryAction: { label: "Browse novels", to: "/novel" },
  },
  featured: {
    bookId: "through-the-storms",
    eyebrow: "Newest arrival",
    heading: "Fresh from\nthe printing press.",
  },
};

/**
 * getGenrePage("fiction")                       → main genre page
 * getGenrePage("fiction", "historical-fiction") → sub-genre page
 * getGenrePage("new-books")                     → new books page
 * Returns null when the genre or sub-genre doesn't exist (show a 404).
 *
 * {
 *   type: "genre" | "subgenre" | "new-books",
 *   genre, subgenre, path,
 *   hero: { eyebrow, title, description },
 *   featured,                         // from GENRES if you added one
 *   books,                            // books for this page
 *   subgenres,                        // sub-genres to show as links / filters
 *   breadcrumb: [{ label, to }],
 * }
 */
export function getGenrePage(genreSlug, subSlug) {
  if (genreSlug === NEW_BOOKS_PAGE.slug && !subSlug) {
    return {
      type: "new-books",
      genre: null,
      subgenre: null,
      path: "/new-books",
      hero: NEW_BOOKS_PAGE.hero,
      featured: NEW_BOOKS_PAGE.featured ?? null,
      books: getNewBooks(BOOKS.length),
      subgenres: [],
      breadcrumb: [{ label: "Home", to: "/" }, { label: NEW_BOOKS_PAGE.hero.title, to: "/new-books" }],
    };
  }

  const genre = GENRE_BY_SLUG.get(genreSlug);
  if (!genre) return null;
  const genreName = cleanName(genre.name);
  const crumbs = [{ label: "Home", to: "/" }, { label: genreName, to: genrePath(genre.slug) }];

  // Main genre page
  if (!subSlug) {
    return {
      type: "genre",
      genre,
      subgenre: null,
      path: genrePath(genre.slug),
      hero: {
        eyebrow: genre.hero?.eyebrow ?? "Browse by genre",
        title: genre.hero?.title ?? genreName,
        description: genre.hero?.description ?? genre.description,
        primaryAction: genre.hero?.primaryAction ?? DEFAULT_HERO_ACTIONS.primaryAction,
        secondaryAction: genre.hero?.secondaryAction ?? DEFAULT_HERO_ACTIONS.secondaryAction,
      },
      featured: genre.featured ?? null,
      books: getBooksByGenre(genre.slug),
      subgenres: getSubgenresWithBooks(genre.slug),
      breadcrumb: crumbs,
    };
  }

  // Sub-genre page — must belong to this genre (/fiction/horror → null)
  const subgenre = (genre.subgenres ?? []).find((s) => s.slug === subSlug);
  if (!subgenre) return null;

  return {
    type: "subgenre",
    genre,
    subgenre: { ...subgenre, genre: genre.slug },
    path: subgenrePath(genre.slug, subgenre.slug),
    hero: {
      eyebrow: subgenre.hero?.eyebrow ?? genreName,
      title: subgenre.hero?.title ?? subgenre.name,
      description: subgenre.hero?.description ?? subgenre.description,
      primaryAction: subgenre.hero?.primaryAction ?? { label: `All ${genreName}`, to: genrePath(genre.slug) },
      secondaryAction: subgenre.hero?.secondaryAction ?? DEFAULT_HERO_ACTIONS.primaryAction,
    },
    featured: subgenre.featured ?? null,
    books: getBooksBySubgenre(subgenre.slug),
    // parent genre, for "All Fiction" links
    parent: { slug: genre.slug, name: genreName, path: genrePath(genre.slug) },
    // the other sub-genres of the same genre, for "More in Fiction" links
    subgenres: getSubgenresWithBooks(genre.slug).filter((s) => s.slug !== subgenre.slug),
    breadcrumb: [...crumbs, { label: subgenre.name, to: subgenrePath(genre.slug, subgenre.slug) }],
  };
}

// Every page path — handy for routes and sitemaps
export const getAllGenrePaths = ({ includeEmpty = true } = {}) => [
  "/new-books",
  ...GENRES.flatMap((g) => [
    genrePath(g.slug),
    ...getSubgenresWithBooks(g.slug, { includeEmpty }).map((s) => s.path),
  ]),
];

/* ------------------------------------------------------------------ */
/* Checks while developing (npm run dev only)                          */
/* ------------------------------------------------------------------ */
if (import.meta.env?.DEV) {
  const seen = new Map();
  for (const s of SUBGENRES) {
    if (GENRE_BY_SLUG.has(s.slug)) console.warn(`books.js: sub-genre "${s.slug}" has the same slug as a main genre`);
    if (seen.has(s.slug)) console.warn(`books.js: sub-genre "${s.slug}" is in both "${seen.get(s.slug)}" and "${s.genre}" — slugs must be unique`);
    seen.set(s.slug, s.genre);
  }
  for (const b of BOOKS) {
    if (!getAuthor(b.authorId)) console.warn(`books.js: "${b.id}" has unknown authorId "${b.authorId}"`);
  }
}
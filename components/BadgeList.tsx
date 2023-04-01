import {useState, useEffect} from "react";

interface Badge {
    id: string;
    cost: number | null;
    description: string;
    global_activity_url: string;
    earn_this_badge_url: string | null;
    enable_earn_this_badge: boolean;
    enable_detail_attribute_visibility: boolean;
    level: string;
    name: string;
    vanity_slug: string;
    time_to_earn: string | null;
    type_category: string;
    show_badge_lmi: boolean;
    show_skill_tag_links: boolean;
    translatable: boolean;
    image: {
        id: string;
        url: string;
    };
    image_url: string;
    url: string;
    issuer: {
        summary: string;
        entities: {
            label: string;
            primary: boolean;
            entity: {
                type: string;
                id: string;
                name: string;
                url: string;
                vanity_url: string;
                internationalize_badge_templates: boolean;
                share_to_ziprecruiter: boolean;
                verified: boolean;
            };
        }[];
    };
    alignments: unknown[];
    badge_template_activities: {
        id: string;
        activity_type: string;
        required_badge_template_id: string | null;
        title: string;
        url: string | null;
    }[];
    endorsements: unknown[];
    skills: {
        id: string;
        name: string;
        vanity_slug: string;
    }[];
}

export default function BadgeList() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        async function fetchBadges() {
            const response = await fetch(
                "https://raw.githubusercontent.com/Joeri-Abbo/python-credly-scraper/master/data/badges.json"
            );
            const data = await response.json();
            console.log(data); // check the data
            const badgeArray = Object.values(data);
            console.log(badgeArray); // check the badge array
            setBadges(badgeArray);
        }

        fetchBadges();
    }, []);

    const filteredBadges = badges.filter((badge) =>
        badge.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredBadges.map((badge) => (
                    <li key={badge.id}>
                        <h3>{badge.name}</h3>
                        <img src={badge.image.url} alt={badge.name}/>
                        <p>{badge.description}</p>
                        <p>Level: {badge.level}</p>
                        <p>Type Category: {badge.type_category}</p>
                        <p>Issuer: {badge.issuer.entities[0].entity.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

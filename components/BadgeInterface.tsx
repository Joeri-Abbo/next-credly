export default interface Badge {
    id: string;
    cost: string | null;
    description: string;
    earn_this_badge_url: string | null;
    level: string;
    name: string;
    type_category: string;
    image: {
        id: string;
        url: string;
    };
}
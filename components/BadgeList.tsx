import {useState, useEffect} from "react";
import Badge from "./BadgeInterface";
import LazyImage from "./LazyImage";

export default function BadgeList() {
    const baseUrl = "https://raw.githubusercontent.com/Joeri-Abbo/python-credly-scraper/master/data/badges/";
    const [badges, setBadges] = useState<Badge[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filter, setFilter] = useState({
        cost: "",
        level: "",
        type_category: "",
    });

    const [typeCategories, setTypeCategories] = useState<string[]>([]);
    const [costs, setCosts] = useState<Array<number | null>>([]);
    const [levels, setLevels] = useState<string[]>([]);

    useEffect(() => {
        async function fetchBadges() {
            const response = await fetch(
                "badges.json"
            );
            const data = await response.json();

            // Convert the object of objects into an array
            const badgeArray: Badge[] = data;
            // const badgeArray: Badge[] = Object.values(data);
            setBadges(badgeArray);
        }

        fetchBadges();
    }, [baseUrl]);

    useEffect(() => {
        // Get unique type_category values
        const uniqueTypeCategories = [
            ...new Set(badges.map((badge) => badge.type_category)),
        ];
        setTypeCategories(uniqueTypeCategories);

        // Get unique cost values and filter out null values
        const uniqueCosts = [
            ...new Set(
                badges.map((badge) => badge.cost).filter((cost) => cost !== null)
            ),
        ];
        setCosts(uniqueCosts);

        // Get unique level values
        const uniqueLevels = [...new Set(badges.map((badge) => badge.level))];
        setLevels(uniqueLevels);
    }, [badges]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFilter({
            ...filter,
            [name]: value,
        });
    };

    const filteredBadges = badges
        .filter((badge) =>
            badge.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(
            (badge) =>
                (filter.cost === "" || badge.cost?.toString() === filter.cost) &&
                (filter.level === "" || badge.level ===
                    filter.level) &&
                (filter.type_category === "" || badge.type_category === filter.type_category)
        );

    return (
        <div>
            <input
                type="text"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-gray-300 p-2 rounded"
            />
            <select
                name="cost"
                value={filter.cost}
                onChange={handleFilterChange}
                className="border-2 border-gray-300 p-2 rounded mx-2"
            >
                <option value="">Select cost</option>
                {costs.map((cost) => (
                    <option key={cost} value={cost}>
                        {cost}
                    </option>
                ))}
            </select>
            <select
                name="level"
                value={filter.level}
                onChange={handleFilterChange}
                className="border-2 border-gray-300 p-2 rounded mx-2"
            >
                <option value="">Select level</option>
                {levels.map((level) => (
                    <option key={level} value={level}>
                        {level}
                    </option>
                ))}
            </select>
            <select
                name="type_category"
                value={filter.type_category}
                onChange={handleFilterChange}
                className="border-2 border-gray-300 p-2 rounded mx-2"
            >
                <option value="">Select type category</option>
                {typeCategories.map((typeCategory) => (
                    <option key={typeCategory} value={typeCategory}>
                        {typeCategory}
                    </option>
                ))}
            </select>
            <ul className="flex flex-wrap p-0 list-none">
                {filteredBadges.map((badge) => (

                    <li
                        key={badge.id}
                        className="flex-0 w-1/5 p-2 border border-gray-300 rounded shadow-sm"
                    >

                        <h3 className="font-bold">{badge.name}</h3>
                        {badge.image && badge.image.url && (
                            <LazyImage
                                src={badge.image.url}
                                alt={badge.name}
                                className="w-full h-auto mb-2"
                            />
                        )}

                        <p>{badge.description}</p>
                        <p>Level: {badge.level}</p>
                        <p>Type Category: {badge.type_category}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

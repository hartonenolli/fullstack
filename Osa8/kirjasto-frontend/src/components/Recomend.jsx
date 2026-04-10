import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, FAVORITE_GENRE } from "../queries";

const Recommend = ({ show, token }) => {
    const { loading, error, data } = useQuery(FAVORITE_GENRE);
    const [recommendations, setRecommendations] = useState([]);
    const favoriteGenre = data?.me?.favoriteGenre;

    const { data: booksData } = useQuery(ALL_BOOKS, {
        skip: !favoriteGenre || !token,
    });

    useEffect(() => {
        if (booksData && favoriteGenre) {
            const recommendedBooks = booksData.allBooks.filter(book =>
                book.genres.includes(favoriteGenre)
            );
            setRecommendations(recommendedBooks);
        }
    }, [booksData, favoriteGenre]);

    if (!show) return null;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h2>Recommended Books</h2>
            <p>Here are some books you might like!</p>
            {token ? (
                <div>
                    <p>Your favorite genre: {favoriteGenre}</p>
                    <ul>
                        {recommendations.map(book => (
                            <li key={book.id}>
                                {book.title} by {book.author.name} (published in {book.published})
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Please log in to see your personalized recommendations.</p>
            )}
        </div>
    );
};

export default Recommend;
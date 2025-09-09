import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const SingleUser = ({ getAll }) => {
    const { id } = useParams();
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const allBlogs = await getAll();
            setBlogs(allBlogs);
        };
        fetchBlogs();
    }, [getAll]);

    const userBlogs = blogs.filter(blog => blog.user.id === id);

    return (
        <div>
            <h3>Blogs created</h3>
            <ul>
                {userBlogs.map(blog => (
                    <li key={blog.id}>{blog.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default SingleUser

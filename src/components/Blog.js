import { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog }) => {
    const [visible, setVisible] = useState(false)
    
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }


    const hideWhenVisible = { display: visible?'none':'' }
    const showWhenVisible = { display: visible?'':'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    return(
        <div style={blogStyle}>
            <div style={hideWhenVisible}>
                {blog.title} {blog.author} <button onClick={toggleVisibility}>view details</button>
            </div>
            <div style={showWhenVisible}>
                <p> {blog.title} {blog.author} <button onClick={toggleVisibility}>hide details</button> </p>
                <p> {blog.url} </p>
                <p> likes: {blog.likes} <button onClick={addLike}>add a like</button> </p>
                <p>{ blog.user === null ? 'posted by Admin' : `posted by ${blog.user.name}`}</p>
                <button onClick={deleteBlog}>remove</button>
            </div>
        </div>
    )
}

export default Blog
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newURL, setNewURL] = useState('')

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value)
    }
    const handleAuthorChange = (event) => {
        setNewAuthor(event.target.value)
    }
    const handleURLChange = (event) => {
        setNewURL(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newURL,
            likes: 0
        })

        setNewTitle('')
        setNewAuthor('')
        setNewURL('')
    }

    return(
        <div>
            <h2> Create a new blog </h2>
            <form onSubmit={addBlog}>
                <div>
                    title: 
                    <input
                        value={newTitle}
                        onChange={handleTitleChange}
                        placeholder="write a title"
                        id="blog-title"
                    />
                </div>
                <div>
                    author:
                    <input
                        value={newAuthor}
                        onChange={handleAuthorChange}
                        placeholder="write an author"
                        id="blog-author"
                    />
                </div>
                <div>
                    url: 
                    <input
                        value={newURL}
                        onChange={handleURLChange}
                        placeholder="write a blog"
                        id="blog-url"
                    />
                </div>
                <button id="blog-submit" type="submit">save</button>
            </form>
        </div>
    )
}

export default BlogForm
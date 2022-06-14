import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [notifTone, setNotifTone] = useState('')
    const [notifMessage, setNotifMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const notify = (error_string, tone) => {
        setNotifMessage(error_string)
        setNotifTone(tone)
        setTimeout(() => {
            setNotifMessage(null)
            setNotifTone('')
        },5000)
    }

    useEffect(() => {
        const fetch = async () => {
            const response = await blogService.getAll()
            setBlogs( response )
        }
        fetch().catch(error=>notify(error.message,'error'))
    }, [])


    useEffect(() => {
        const loggerUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if(loggerUserJSON){
            const user = JSON.parse(loggerUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])



    // forms

    const logInForm = () => {
        return(
            <Togglable buttonLabel='login'>
                <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    handleSubmit={handleLogin}
                />
            </Togglable>
        )
    }

    const logOutForm = () => (
        <button type="submit" onClick={handleLogOut}>Log Out</button>
    )

    const blogFormRef = useRef()

    const blogForm = () => (
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog}/>
        </Togglable>
    )

    // form utilities

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)

        try{
            const user = await loginService.login({
                username, password
            })

            // enables caching in browser
            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)

            notify(`logged in ${username} as ${user.name}`, 'success')
            
            setUsername('')
            setPassword('')
        } catch (error) {
            notify(error.message, 'error')
        }

    }

    const handleLogOut = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
    }

    // put request creator
    const addLikeTo = async (id) => {
        const blog = blogs.find(n => n.id === id)
        const changedBlog = { ...blog, likes: blog.likes+1 }
        
        try{
            const update_response = await blogService.update(id, changedBlog)
            setBlogs(blogs.map(blog => blog.id !== id ? blog : update_response))
        } catch(error) {
            notify(error.message, 'error')
        }
    }

    const addBlog = async (blogObject) => {
        blogFormRef.current.toggleVisibility()
        
        try{
            const create_response = await blogService.create(blogObject)
            setBlogs(blogs.concat(create_response))
        } catch(error) {
            notify(error.message,'error')
        }
    }
    
    const deleteBlog = async (id) => {
        try{
            const delete_response = await blogService.deleteItem(id)
            notify(delete_response.message, 'success')
        } catch(error) {
            return notify(error.message, 'error')
        }

        try{
            const response = await blogService.getAll()
            setBlogs( response )
        }catch(error){
            notify('could not reach server', error)
        }

    }


    const unlockedPage = () => (
        <div>
            <p>{user.name} logged-in</p>
            {logOutForm()}
            {blogForm()}
            <h2>blogs</h2>
            {
                blogs.sort((a,b) => b.likes-a.likes)
                    .map(blog => (
                        <Blog 
                            key={blog.id}
                            blog={blog}
                            addLike={() => addLikeTo(blog.id)}
                            deleteBlog={() => deleteBlog(blog.id)}
                        />
                    ))
            }
        </div>
    )

    return (
        <div>
            <h1>Blog</h1>
            <Notification message={notifMessage} tone={notifTone}/>
            <h2>login</h2>
            {
                user===null
                    ? logInForm()
                    : unlockedPage()
            }
        </div>
    )
}

export default App

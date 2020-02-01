import React, { useState, useEffect } from 'react';
import loginService from './services/login'
import BlogService from './services/blogs'
import Blog from './components/Blog'
import CreateBlog from './components/Create'
import Notification from './components/Notification'
//import logo from './logo.svg';
//import './App.css';

function App() {

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    BlogService
      .getAll().then(initialBlogs => {
        setBlogs(initialBlogs)

        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
          setUser(user)
          BlogService.setToken(user.token)
    
        }

      })
  }, [])

  console.log(user)

  // useEffect(() => {
  //   const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  //   if (loggedUserJSON) {
  //     const user = JSON.parse(loggedUserJSON)
  //     setUser(user)
  //     BlogService.setToken(user.token)

  //   }
  // }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      BlogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setUsername('')
      setPassword('')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log(exception)
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>  
    </div>    
  )

  const noteForm = () => (
    // <form onSubmit={addNote}>
    //   <input
    //     value={newNote}
    //     onChange={handleNoteChange}
    //   />
    //   <button type="submit">save</button>
    // </form>  
    <div>
    <h2>blogs</h2>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
      //<p>{blog.title}</p>
    )}
  </div>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = () => {

    const b = {author : author, title: title, url: url}
    BlogService.create(b).then(res => {
      BlogService
      .getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
        setAuthor('')
        setTitle('')
        setUrl('')
      
    })
  })
}

  return (
    <div className="App">

      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
          <div>
            <p>{user.name} logged in  <button onClick={logout}>logout</button></p>
            <h2>create new blog</h2>
            <CreateBlog author={author} title={title} url={url} setAuthor={setAuthor} setTitle={setTitle} setUrl={setUrl} addBlog={addBlog} />
            {noteForm()}
          </div>
}
    </div>
  );
}

export default App;

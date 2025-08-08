lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((fav, blog) => {
        return (fav.likes || 0) < blog.likes ? blog : fav
    }, {})
}

const mostBlogs = (blogs) => {
    const authorBlogs = lodash._.countBy(blogs, 'author')
    console.log('Author blogs count:', authorBlogs);
    const nameOfAuthorWithMostBlogs = lodash._.maxBy(Object.keys(authorBlogs), (author) => authorBlogs[author])
    console.log('Author with most blogs:', nameOfAuthorWithMostBlogs);
    return {
        author: nameOfAuthorWithMostBlogs,
        blogs: authorBlogs[nameOfAuthorWithMostBlogs]
    }
}

const mostLikes = (blogs) => {
    const authorLikes = lodash._.groupBy(blogs, 'author')
    console.log('Author likes count:', authorLikes);
    const authorWithMostLikes = lodash._.maxBy(Object.keys(authorLikes), (author) => lodash._.sumBy(authorLikes[author], 'likes'))
    console.log('Author with most likes:', authorWithMostLikes);
    const totalLikesForAuthor = lodash._.sumBy(authorLikes[authorWithMostLikes], 'likes')
    console.log('Total likes for author:', totalLikesForAuthor);
    return {
        author: authorWithMostLikes,
        likes: lodash._.sumBy(authorLikes[authorWithMostLikes], 'likes')
    }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
} 
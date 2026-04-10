const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const resolvers = {
    Query: {
        bookCount: async () => await Book.collection.countDocuments(),
        authorCount: async () => await Author.collection.countDocuments(),
        allBooks: async (_, args) => {
            let filter = {}

            if (args.name) {
                const author = await Author.findOne({ name: args.name })
                if (!author) return []
                filter.author = author._id
            }

            if (args.genre) {
                filter.genres = { $in: [args.genre] }
            }

            const books = await Book.find(filter)
            return books
        },
        allAuthors: async () => Author.find({}),
        me: async (_, __, { currentUser }) => currentUser,
        genres: async () => {
            const books = await Book.find({})
            const genres = new Set()
            books.forEach(book => {
                book.genres.forEach(genre => genres.add(genre))
            })
            return Array.from(genres)
        },
    },

    Book: {
        author: async (book) => {
            if (!book.author) return null
            return Author.findById(book.author)
        }
    },
    Author: {
        bookCount: (author) => Book.find({ author: author._id }).then(books => books.length)
    },

    Mutation: {
        addBook: async (_, args, { currentUser }) => {
            let author = await Author.findOne({ name: args.author })
            if (!currentUser) {
                throw new GraphQLError('Not authenticated', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    }
                })
            }
            if (!args.title || !args.author) {
                throw new GraphQLError('Title and author are required', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args,
                    }
                })
            }
            if (args.title.length < 3) {
                throw new GraphQLError('Title must be at least 3 characters long', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args,
                    }
                })
            }
            if (args.author.length < 3) {
                throw new GraphQLError('Author name must be at least 3 characters long', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args,
                    }
                })
            }
            if (!author) {
                author = new Author({ name: args.author })
                await author.save()
            }
            const book = new Book({ ...args, author: author._id })
            await book.save()
            return book
        },
        editAuthor: async (_, args, { currentUser }) => {
            if (!currentUser) {
                throw new GraphQLError('Not authenticated', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    }
                })
            }
            const author = await Author.findOne({ name: args.name })
            if (!author) return null
            author.born = args.setBornTo
            await author.save()
            return author
        },
        createUser: async (_, args) => {
            const user = new User({ ...args })
            await user.save()
            return user
        },
        login: async (_, args) => {
            const user = await User.findOne({ username: args.username })
            if (!user || args.password !== 'secret') {
                throw new GraphQLError('Invalid credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args,
                    }
                })
            }
            const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET)
            return { value: token }
        }
    }
}

module.exports = resolvers
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
    Query: {
        bookCount: async () => await Book.collection.countDocuments(),
        authorCount: async () => await Author.collection.countDocuments(),
        allBooks: async (_, args) => {
            let filteredBooks = await Book.find({})
            if (args.name) {
                filteredBooks = filteredBooks.filter(book => book.author === args.name)
            }
            if (args.genre) {
                filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre))
            }
            return filteredBooks
        },
        allAuthors: async () => Author.find({}),
    },
    Book: {
        author: (book) => authors.find(a => a.name === book.author)
    },
    Author: {
        bookCount: (author) => books.filter(book => book.author === author.name).length
    },
    Mutation: {
        addBook: (_, args) => {
            const book = { ...args, id: uuid() }
            books = books.concat(book)
            if (!authors.find(a => a.name === args.author)) {
                authors = authors.concat({ name: args.author, id: uuid() })
            }
            return book
        },
        editAuthor: (_, args) => {
            const author = authors.find(a => a.name === args.name)
            if (!author) return null
            const updated = { ...author, born: args.setBornTo }
            authors = authors.map(a => a.name === args.name ? updated : a)
            return updated
        }
    }
}

module.exports = resolvers
const Author = require('./models/author')
const Book = require('./models/book')

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

            return Book.find(filter)
        },
        allAuthors: async () => Author.find({}),
    },
    Book: {
        author: (book) => Author.findOne({ name: book.author })
    },
    Author: {
        bookCount: (author) => Book.find({ author: author.name }).then(books => books.length)
    },
    Mutation: {
        addBook: async (_, args) => {
            let author = await Author.findOne({ name: args.author })
            if (!author) {
                author = new Author({ name: args.author })
                await author.save()
            }
            const book = new Book({ ...args, author: author._id })
            await book.save()
            return book
        },
        editAuthor: async (_, args) => {
            const author = await Author.findOne({ name: args.name })
            if (!author) return null
            author.born = args.setBornTo
            await author.save()
            return author
        }
    }
}

module.exports = resolvers
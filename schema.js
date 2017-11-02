const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require('graphql')

const Category = new GraphQLObjectType({
  name: 'Category',
  description: '...',
  fields: () => ({
    id: { type: GraphQLInt, resolve: xml => xml.$.id },
    name: { type: GraphQLString, resolve: xml => xml.$.value }
  })
})

const Mechanic = new GraphQLObjectType({
  name: 'Mechanic',
  description: '...',
  fields: () => ({
    id: { type: GraphQLInt, resolve: xml => xml.$.id },
    name: { type: GraphQLString, resolve: xml => xml.$.value }
  })
})

const Expansion = new GraphQLObjectType({
  name: 'Expansion',
  description: '...',
  fields: () => ({
    id: { type: GraphQLInt, resolve: xml => xml.$.id },
    name: { type: GraphQLString, resolve: xml => xml.$.value }
  })
})

const Compilation = new GraphQLObjectType({
  name: 'Compilation',
  description: '...',
  fields: () => ({
    id: { type: GraphQLInt, resolve: xml => xml.$.id },
    name: { type: GraphQLString, resolve: xml => xml.$.value }
  })
})

const Implementation = new GraphQLObjectType({
  name: 'Implementation',
  description: '...',
  fields: () => ({
    id: { type: GraphQLInt, resolve: xml => xml.$.id },
    name: { type: GraphQLString, resolve: xml => xml.$.value }
  })
})

const Designer = new GraphQLObjectType({
  name: 'Designer',
  description: '...',
  fields: () => ({
    id: { type: GraphQLInt, resolve: xml => xml.$.id },
    name: { type: GraphQLString, resolve: xml => xml.$.value }
  })
})

const Artist = new GraphQLObjectType({
  name: 'Artist',
  description: '...',
  fields: () => ({
    id: { type: GraphQLInt, resolve: xml => xml.$.id },
    name: { type: GraphQLString, resolve: xml => xml.$.value }
  })
})

const Publisher = new GraphQLObjectType({
  name: 'Publisher',
  description: '...',
  fields: () => ({
    id: { type: GraphQLInt, resolve: xml => xml.$.id },
    name: { type: GraphQLString, resolve: xml => xml.$.value }
  })
})

const Family = new GraphQLObjectType({
  name: 'Family',
  description: '...',
  fields: () => ({
    id: { type: GraphQLInt, resolve: xml => xml.$.id },
    name: { type: GraphQLString, resolve: xml => xml.$.value }
  })
})

const SingleGameType = new GraphQLObjectType({
  name: 'SingleGame',
  description: '...',

  fields: () => ({
    gameId: { type: GraphQLInt, resolve: xml => xml.$.id },
    name: { type: GraphQLString, resolve: xml => xml.name[0].$.value },
    image: { type: GraphQLString, resolve: xml => xml.image[0] },
    thumbnail: { type: GraphQLString, resolve: xml => xml.thumbnail[0] },
    description: { type: GraphQLString, resolve: xml => xml.description[0] },
    minplayers: { type: GraphQLString, resolve: xml => xml.minplayers[0].$.value },
    maxplayers: { type: GraphQLString, resolve: xml => xml.maxplayers[0].$.value },
    minplaytime: { type: GraphQLString, resolve: xml => xml.minplaytime[0].$.value },
    maxplaytime: { type: GraphQLString, resolve: xml => xml.maxplaytime[0].$.value },
    minage: { type: GraphQLString, resolve: xml => xml.minage[0].$.value },
    yearpublished: { type: GraphQLString, resolve: xml => xml.yearpublished[0].$.value },
    mechanics: {type: new GraphQLList(Mechanic), resolve: xml => xml.link
      .filter(link => link.$.type === 'boardgamemechanic')
    },
    categories: {
      type: new GraphQLList(Category), resolve: xml => xml.link
        .filter(link => link.$.type === 'boardgamecategory')
    },
    designers: {
      type: new GraphQLList(Designer), resolve: xml => xml.link
        .filter(link => link.$.type === 'boardgamedesigner')
    },
    artists: {
      type: new GraphQLList(Designer), resolve: xml => xml.link
        .filter(link => link.$.type === 'boardgameartist')
    },
    publishers: {
      type: new GraphQLList(Publisher), resolve: xml => xml.link
        .filter(link => link.$.type === 'boardgamepublisher')
    },
    expansions: {
      type: new GraphQLList(Expansion), resolve: xml => xml.link
        .filter(link => link.$.type === 'boardgameexpansion')
    },
    compilation: {
      type: new GraphQLList(Expansion), resolve: xml => xml.link
        .filter(link => link.$.type === 'boardgamecompilation')
    },
    implementation: {
      type: new GraphQLList(Expansion), resolve: xml => xml.link
        .filter(link => link.$.type === 'boardgameimplementation')
    },
    family: {
      type: new GraphQLList(Expansion), resolve: xml => xml.link
        .filter(link => link.$.type === 'boardgamefamily')
    },
  }),
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
      // thing: {
      //   type: SingleGameType,
      //   args: {
      //     id: { type: GraphQLInt }
      //   },
      //   resolve: (root, args) =>
      //     fetch(`https://www.boardgamegeek.com/xmlapi2/thing?id=${args.id}`)
      //       .then(response => response.text())
      //       .then(parseXML)
      //       .then(xml => xml.items.item[0])
      // },
      things: {
        type: new GraphQLList(SingleGameType),
        args: {
          ids: { type: new GraphQLList(GraphQLInt) }
        },
        resolve: (root, args) =>
          fetch(`https://www.boardgamegeek.com/xmlapi2/thing?id=${args.ids}`)
            .then(response => response.text())
            .then(parseXML)
            .then(xml => xml.items.item)
      }
    })
  })
})

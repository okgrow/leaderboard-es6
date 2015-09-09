/* ES6 notes
  semi-colons are not required (never have been FYI)
  object literal short-hand lets you omit colon ':' and function keyword
  'return' is optional for single-expression arrow functions: (e) => e.target
  braces '{}' are required for multiple-statement arrow functions:
     (e) => {
       let $target = $(e.target)
       return $target.val()
     }
  argument parens are optional for single-argument arrow functions: e => e.target
  object literal {name: name} can be simply {name}
*/

// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players")

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players() {return Players.find({}, { sort: { score: -1, name: 1 } })},
    selectedName() {
      let player = Players.findOne(Session.get("selectedPlayer"))
      return player && player.name
    }
  })

  Template.leaderboard.events({
    'click .inc'() {
      Players.update(Session.get("selectedPlayer"), {$inc: {score: 5}})
    }
  })

  Template.player.helpers({
    selected() {
      return Session.equals("selectedPlayer", this._id) ? "selected" : ''
    }
  })

  Template.player.events({
    click() {
      Session.set("selectedPlayer", this._id)
    }
  })
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(() => {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace", "Grace Hopper", "Marie Curie",
                   "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"]
      names.forEach(name =>
        Players.insert({
          name,
          score: Math.floor(Random.fraction() * 10) * 5
        })
      )
    }
  })
}

const fs = require('fs');
const test = require('tape');
const mainHelper = require('../main_helper');
const urlutils = require('../lib/urlUtils');

const urlExpectedResult =
`type todos {
  userId: Int
  id: Int
  title: String
  completed: Boolean
}`;

const uriExpectedResult =
`type cpe {
  _id: String
  org: String
  dates: [Date]
  state: String
  location: String
  club: String
  urls: [Id]
  days: Date
  longLat: [Float]
}`;

test('file', function(t) {
  const expectedSchema = fs.readFileSync('./tests/data/akcschema.txt').toString();
  mainHelper.doit( {
    unitTestMode: true,
    clean: true
  }, [ '../tests/data/akc.json'])
  .then((results) => results[0])
    .then((result) => {
      t.equals(result.id, 'akc');
      t.equals(result.schema + '\n', expectedSchema);
    })
    .then(() => t.end())
    .catch((err) => { t.error(err); t.end(); });
})

test("URL", function(t) {
  mainHelper.doit( {
    unitTestMode: true,
    url: "https://jsonplaceholder.typicode.com/todos"
  }, [])
    .then((results) => results[0])
    .then((result) => {
      t.equals(result.id, 'todos');
      t.equals(result.schema, urlExpectedResult);
    })
    .then(() => t.end())
    .catch((err) => { t.error(err); t.end(); });

});

test("URI", function(t) {
  mainHelper.doit( {
    unitTestMode: true,
    uri: process.env.MONGOLAB_URI
  }, [])
    .then((results) => results[1])  // cpe
    .then((result) => {
      t.equals(result.id, 'cpe');
      t.equals(result.schema, uriExpectedResult);
    })
    .then(() => t.end())
    .catch((err) => {  t.error(err); t.end(); });
});

test("Github", function(t) {
  const expectedSchema = fs.readFileSync('./tests/data/github1schema.txt').toString();
  mainHelper.doit( {
    unitTestMode: true,
    url: "https://api.github.com/repos/vmg/redcarpet/issues?state=closed"
  }, [])
    .then((results) => results[0])
    .then((result) => {
      t.equals(result.id, 'repos_vmg_redcarpet_issues');
      t.equals(result.schema + '\n', expectedSchema);
    })
    .then(() => t.end())
    .catch((err) => {  t.error(err); t.end(); });
});


test("createHeaders", function(t) {
  let h = urlutils.createHeaders( { foo: 1}, "bar:bar:1");
  // console.dir(h);
  t.equals(h.foo, 1);
  t.equals(h.bar, "bar:1");
  t.end();
})

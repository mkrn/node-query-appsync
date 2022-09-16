const queryGraphQL = require("../lib/queryGraphQL");

const eventsQuery = {
  operationName: 'MyEvents',
  query:
    `query MyEvents($id: String) {
        events(id: $id) {
            title
        }
    }`
  ,
  variables: {
    id: "Test"
  }
};

(async function() {
  try {
    const res = await queryGraphQL(eventsQuery);
    const { data } = res;
    console.log(data);
  } catch (err) {
    console.error(err);
  }
})();
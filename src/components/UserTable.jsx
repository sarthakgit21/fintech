import { useEffect, useState } from "react";

const UserTable = () => {
  const [user_data, setUser_data] = useState();
  useEffect(() => {
    async function fetchGraphQL(operationsDoc, operationName, variables) {
      const result = await fetch(
        "https://able-spider-61.hasura.app/v1beta1/relay",
        {
          method: "POST",
          body: JSON.stringify({
            query: operationsDoc,
            variables: variables,
            operationName: operationName,
          }),
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret":
              "Ae7JnZ5Fu1SqZ5UhbLeQOc7fLdLDwyqIgmuGBgjDvqaWXlieHAntYtcTfufDROmR",
          },
        }
      );

      return await result.json();
    }

    const operationsDoc = `
      # Consider giving this query a unique, descriptive
      # name in your application as a best practice
      query unnamedQuery1 {
        user_connection {
          edges {
            node {
              id
              balance
              name
            }
          }
        }
      }
    `;

    function fetchUnnamedQuery1() {
      return fetchGraphQL(operationsDoc, "unnamedQuery1", {});
    }

    async function startFetchUnnamedQuery1() {
      const { errors, data } = await fetchUnnamedQuery1();

      if (errors) {
        // handle those errors like a pro
        console.error(errors);
      }

      const resultArray = data.user_connection.edges.map((edge) => ({
        name: edge.node.name,
        amount: edge.node.balance,
      }));
      setUser_data(resultArray);
    }

    startFetchUnnamedQuery1();
  },[user_data]);

  return (
    <div>
      <h1>Hello Users</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {user_data &&
            user_data.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.amount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

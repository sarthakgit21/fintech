import { useState } from "react";

const UserForm = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [final, setFinal] = useState();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async (num) => {
    event.preventDefault();
    async function fetchGraphQL2(operationsDoc, operationName, variables) {
      const result = await fetch(
        "https://able-spider-61.hasura.app/v1beta1/relay",
        {
          method: "POST",
          body: JSON.stringify({
            query: operationsDoc2,
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

    const operationsDoc2 = `
        query MyQuery {
          user_connection(where: {name: {_eq: ${name}}}) {
            edges {
              node {
                balance
              }
            }
          }
        }
      `;

    function fetchMyQuery2() {
      return fetchGraphQL2(operationsDoc2, "MyQuery", {});
    }

    async function startFetchMyQuery2() {
      const { errors, data } = await fetchMyQuery2();

      if (errors) {
        console.error(errors);
      }
      console.log(data);
      const balance = data.user_connection.edges[0].node.balance;
      return parseInt(balance);
    }

    async function fetchGraphQL(operationsDoc, operationName, variables) {
      const val = await startFetchMyQuery2();
      var value = parseInt(amount);
      console.log(value);

      if (num === 1) {
        value = value+ val;
      } else {
        value = val - value;
      } setFinal(value);
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
    mutation unnamedMutation1 {
      insert_user(objects: [{name: "${name}", balance: ${final}}], on_conflict: {constraint: user_pkey, update_columns: [balance]}) {
        affected_rows
        returning {
          id
          name
          balance
        }
      }
    }
  `;

    function executeUnnamedMutation1() {
      return fetchGraphQL(operationsDoc, "unnamedMutation1", {});
    }

    async function startExecuteUnnamedMutation1() {
      const { errors, data } = await executeUnnamedMutation1();

      if (errors) {
        console.error(errors);
      }
      console.log(data);
    }

    startExecuteUnnamedMutation1();
  };
  return (
    <div>
      <h1>User Form</h1>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            required
          />
        </div>
        <p> Double click for transaction </p>
        <button onClick={() => handleSubmit(1)} type="submit">
          Deposit
        </button>
        <button onClick={() => handleSubmit(2)} type="submit">
          Withdrawal
        </button>
      </form>
    </div>
  );
};

export default UserForm;

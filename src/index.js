import React, { Component } from "react";
import { render } from "react-dom";
import QueryBuilder from "./modules/queryBuilder";

const masterOperators = [
  { value: "=", type: "comparator", application: "number" },
  { value: "-", type: "binary", application: "number" },
  { value: "+", type: "binary", application: "number" },
  { value: "x", type: "binary", application: "number" },
  { value: "/", type: "binary", application: "number" },
  { value: ">", type: "comparator", application: "number" },
  { value: ">=", type: "comparator", application: "number" },
  { value: "<", type: "comparator", application: "number" },
  { value: "<=", type: "comparator", application: "number" },
  { value: "between", type: "range", application: "number" },
];
const masterVariables = [
  { value: "abc", type: "string" },
  { value: "def", type: "string" },
  { value: "ijk", type: "string" },
  { value: "lmn", type: "string" },
  { value: "opq", type: "number" },
  { value: "rst", type: "number" },
  { value: "uvw", type: "number" },
];

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <QueryBuilder
          masterOperators={masterOperators}
          masterVariables={masterVariables}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));

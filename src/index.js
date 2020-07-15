import React, { Component } from "react";
import { render } from "react-dom";
import QueryBuilder from "./modules/queryBuilder";

const masterFields = [
  { value: "=", type: "comparator", category: "operator" },
  { value: "-", type: "binary", category: "operator" },
  { value: "+", type: "binary", category: "operator" },
  { value: "x", type: "binary", category: "operator" },
  { value: "/", type: "binary", category: "operator" },
  { value: ">", type: "comparator", category: "operator" },
  { value: ">=", type: "comparator", category: "operator" },
  { value: "<", type: "comparator", category: "operator" },
  { value: "<=", type: "comparator", category: "operator" },
  { value: "abc", dataType: "string", category: "variable" },
  { value: "def", dataType: "string", category: "variable" },
  { value: "ijk", dataType: "string", category: "variable" },
  { value: "lmn", dataType: "string", category: "variable" },
  { value: "opq", dataType: "number", category: "variable" },
  { value: "rst", dataType: "number", category: "variable" },
  { value: "uvw", dataType: "number", category: "variable" },
  { value: "Add(+) function", type: "binary", category: "operator", subCategory: "function" },
  { value: "Min/Max", type: "range", category: "operator", subCategory: "range"}
];

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <QueryBuilder masterFields={masterFields} />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));

import React, { Component } from "react";
import { render } from "react-dom";
import { Tabs } from "antd";
import {
  ApartmentOutlined,
  GroupOutlined,
  CloseOutlined,
  PlusOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import "./styles.css";
import { Button } from "antd";
import { data, timers } from "jquery";

const { TabPane } = Tabs;

const logicalOperators = [
  { value: "$or", label: "OR" },
  { value: "$and", label: "AND" },
  { value: "$not", label: "NOT" },
];

export default class QueryBuilder extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
      logicData: {
        id: 24,
        type: "group",
        selectedOperator: "$or",
        conditions: [
          // {
          //   id: 23,
          //   type: "standalone",
          //   variables: [],
          //   operators: [],
          // },
          // {
          //   id: 24,
          //   type: "group",
          //   selectedOperator: "$and",
          //   conditions: [],
          // },
        ],
      },
    };
  }

  render() {
    return (
      <div className="queryBuilder">
        <div className="row">
          <Tabs
            style={
              !this.state.logicData.conditions ||
              this.state.logicData.conditions.length < 2
                ? { pointerEvents: "none", opacity: 0.4 }
                : {}
            }
            defaultActiveKey={this.state.logicData.selectedOperator}
            onChange={(e) => this.selectOperator(this.state.logicData, e)}
          >
            {logicalOperators &&
              logicalOperators.map((operator) => (
                <TabPane tab={operator.label} key={operator.value} />
              ))}
          </Tabs>

          <span className={"btnGroup"}>
            <span>
              <Button
                type="default"
                icon={<PlusOutlined />}
                size={"medium"}
                onClick={() =>
                  this.addCondition(this.state.logicData.conditions)
                }
              >
                Add Rule
              </Button>
            </span>

            <span>
              <Button
                type="default"
                icon={<PlusCircleOutlined />}
                size="medium"
                onClick={() => this.addGroup(this.state.logicData.conditions)}
              >
                Add Group
              </Button>
            </span>
          </span>

          <div className="mainSection">
            {this.state.logicData.conditions &&
              this.state.logicData.conditions.length > 0 &&
              this.returnConditions(this.state.logicData.conditions)}
          </div>
        </div>

        <div className={"box"}>
          <Button
            className={"button"}
            type="primary"
            onClick={() => this.saveData()}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  handleOperators(condition, e, i) {
    let selectedOptions = e && e.target && e.target.selectedOptions;

    condition.fields.forEach((field, _i) => {
      if (i === _i) {
        field.type = selectedOptions[0].getAttribute("_type") || "";
        field.value = e.target.value;
        field.category = "operator";
      }
    });

    condition.fields.forEach((_field, _i) => {
      if (_i > i) {
        condition.fields.splice(_i, condition.fields.length);
      }
    });

    let field = condition.fields[i];
    let lastId = condition.fields[condition.fields.length - 1]["id"] || 0;
    let isNextEntryPresent = condition.fields[i + 1];
    // if next entry not present.
    if (!isNextEntryPresent) {
      if (field && field.type === "binary") {
        condition.fields.push({
          id: lastId + 1,
          category: "variable",
          value: null,
          type: null,
        });
      } else if (field && field.type === "range") {
        condition.fields.push({
          id: lastId + 1,
          category: "operator",
          subCategory: "range",
          value: null,
          type: "range",
        });
      } else {
        condition.fields.push({
          id: lastId + 1,
          category: "input",
          value: null,
          type: null,
        });
      }
    }

    this.setState({ ...this.state });
    console.log(this.state);
  }

  handleVariables(condition, e, index) {
    let selectedOptions = e.target.selectedOptions;
    //updating value for current variable
    condition.fields.forEach((field, i) => {
      if (index === i) {
        field.value = e.target.value;
        field.dataType =
          (selectedOptions &&
            selectedOptions[0] &&
            selectedOptions[0].getAttribute("_type")) ||
          "";
        field.category = "variable";
      }
    });

    //pushing object for new operator
    let lastId = condition.fields[condition.fields.length - 1]["id"] || 0;
    let isNextEntryPresent = condition.fields[index + 1];
    // if next entry not present.
    if (!isNextEntryPresent) {
      condition.fields.push({
        id: lastId + 1,
        category: "operator",
        value: null,
        type: null,
      });
    }

    this.setState({ ...this.state });
  }

  handleTextInput(condition, e, i) {
    condition.fields.forEach((field, _i) => {
      if (_i === i) {
        field.value = e.target.value;
        field.category = "input";
      }
    });
  }

  handleMinValue(condition, e, i) {
    condition.fields.forEach((f, _i) => {
      if (i === _i) {
        f.minValue = e.target.value;
      }
    });
    this.setState({ ...this.state });
  }

  handleMaxValue(condition, e, i) {
    condition.fields.forEach((f, _i) => {
      if (i === _i) {
        f.maxValue = e.target.value;
      }
    });
    this.setState({ ...this.state });
  }

  returnQueryTemplate(condition) {
    const { masterFields } = this.props;
    let firstOperator = condition.fields[0];
    let fields = condition.fields;
    return (
      <span>
        {fields.map((field, i) => (
          <span>
            {field.category === "input" ? (
              <span className="box">
                <input
                  value={field.value}
                  type="text"
                  onChange={(e) => this.handleTextInput(condition, e, i)}
                />
              </span>
            ) : field.category === "operator" &&
              field.subCategory === "range" ? (
              <span>
                <input
                  value={field.minValue}
                  type="text"
                  placeholder={"Enter lower limit"}
                  onChange={(e) => this.handleMinValue(condition, e, i)}
                />
                <input
                  value={field.maxValue}
                  type="text"
                  placeholder={"Enter higher limit"}
                  onChange={(e) => this.handleMaxValue(condition, e, i)}
                />
              </span>
            ) : (
              <select
                onChange={(e) =>
                  field.category === "operator"
                    ? this.handleOperators(condition, e, i)
                    : this.handleVariables(condition, e, i)
                }
              >
                <option disabled selected={!field || !field.value} value>
                  -- Select an option --{" "}
                </option>

                {masterFields
                  .filter((f) => f.category === field.category)
                  .map((operator) => (
                    <option _type={operator.type}>{operator.value}</option>
                  ))}
              </select>
            )}
          </span>
        ))}
      </span>
    );
  }

  returnConditions(conditions) {
    const { masterFields } = this.props;
    console.log(masterFields);
    return (
      <div className={"groupConditions"}>
        {conditions.map((condition, index) => {
          return (
            <div className="gridRow">
              <span className="dottedHorizonalGrid" />
              {condition.type === "standalone" ? (
                <div className="conditionRow">
                  {condition &&
                    condition.fields &&
                    condition.fields[0] &&
                    this.returnQueryTemplate(condition)}

                  <CloseOutlined
                    className={"closeIconCondition"}
                    style={{ float: "right" }}
                    onClick={() => {
                      conditions.splice(index, 1);
                      this.setState({ ...this.state });
                    }}
                  />
                </div>
              ) : condition.type === "group" ? (
                <div className="groupRow">
                  <div className="tabsRow">
                    <Tabs
                      defaultActiveKey={condition.selectedOperator}
                      onChange={(e) => this.selectOperator(condition, e)}
                    >
                      {logicalOperators &&
                        logicalOperators.map((operator) => (
                          <TabPane tab={operator.label} key={operator.value} />
                        ))}
                    </Tabs>

                    <span className={"btnGroup"}>
                      <span>
                        <Button
                          type="default"
                          icon={<PlusOutlined />}
                          size={"medium"}
                          onClick={() =>
                            this.addCondition(condition.conditions)
                          }
                        >
                          Add Rule
                        </Button>
                      </span>

                      <span>
                        <Button
                          type="default"
                          icon={<PlusCircleOutlined />}
                          size="medium"
                          onClick={() => this.addGroup(condition.conditions)}
                        >
                          Add Group
                        </Button>
                      </span>

                      <span className={"box"}>
                        <CloseOutlined
                          className={"closeIcon"}
                          style={{
                            position: "relative",
                            top: "9px",
                          }}
                          onClick={() => {
                            conditions.splice(index, 1);
                            this.setState({ ...this.state });
                          }}
                        />
                      </span>
                    </span>
                  </div>
                  {condition.conditions &&
                    condition.conditions.length > 0 &&
                    this.returnConditions(condition.conditions)}
                </div>
              ) : null}
            </div>
          );
        })}
        <span className="gridWhiteOut"></span>
      </div>
    );
  }

  addCondition(conditions) {
    let lastElement = conditions && conditions[conditions.length - 1];
    let previousId = (lastElement && lastElement["id"]) || 0;
    conditions.push({
      id: previousId + 1,
      type: "standalone",
      fields: [
        {
          id: 1,
          dataType: "number",
          category: "variable",
          value: null,
        },
      ],
    });
    this.setState({ ...this.state });
  }

  addGroup(conditions) {
    let lastElement = conditions && conditions[conditions.length - 1];
    let previousPageId = lastElement && lastElement["id"];
    conditions.push({
      id: previousPageId + 1,
      type: "group",
      selectOperator: "$and",
      conditions: [],
    });
    this.setState({ ...this.state });
  }

  //   selectOperator(group, value) {
  //     group.selectedOperator = value;
  //   }

  //   saveData() {
  //     console.log(this.state);
  //   }
  // }
}

import React, { Component } from "react";
import { render } from "react-dom";
import { Tabs } from "antd";
import {
  ApartmentOutlined,
  GroupOutlined,
  CloseOutlined,
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
          //   {
          //     id: 23,
          //     type: "standalone",
          //     operand1: {
          //       type: "Number",
          //       value: null,
          //     },
          //     operator1: null,
          //     operand2: null,
          //     operator2: null,
          //     operand3: null,
          //   },
          //   {
          //     id: 24,
          //     type: "group",
          //     selectedOperator: "$and",
          //     conditions: [],
          //   },
        ],
      },
    };
  }

  render() {
    return (
      <div className="queryBuilder">
        <div className="row">
          <Tabs
            style={(!this.state.logicData.conditions || this.state.logicData.conditions.length < 2) ? {pointerEvents: "none", opacity: 0.4}: {}}
            defaultActiveKey={this.state.logicData.selectedOperator}
            onChange={(e) => this.selectOperator(this.state.logicData, e)}
          >
            {logicalOperators &&
              logicalOperators.map((operator) => (
                <TabPane tab={operator.label} key={operator.value} />
              ))}
          </Tabs>

          <span>
            <span className="box">
              <span className="tooltip">
                <ApartmentOutlined
                  className="icon"
                  onClick={() =>
                    this.addCondition(this.state.logicData.conditions)
                  }
                />
                <span class="tooltiptext">Add Condition</span>
              </span>
            </span>

            <span className="box">
              <span className="tooltip">
                <GroupOutlined
                  className="icon"
                  onClick={() => this.addGroup(this.state.logicData.conditions)}
                />
                <span class="tooltiptext">Add Group</span>
              </span>
            </span>
          </span>

          <div className="mainSection">
            {this.state.logicData.conditions &&
              this.state.logicData.conditions.length > 0 &&
              this.returnConditions(this.state.logicData.conditions)}
          </div>
        </div>

        <div className={"box"}>
          <Button className={"button"} type="primary" onClick={() => this.saveData()}>
            Save
          </Button>
        </div>
      </div>
    );
  }

  resetFields(condition) {
    // condition.operator1 = null;
    condition.operand2 = null;
    condition.operator2 = null;
    condition.operand3 = null;
    this.setState({ ...this.state });
  }

  handleOperators(condition, operatorKey, e) {
    let selectedOptions = e && e.target && e.target.selectedOptions;
    condition[operatorKey] = {
      type: (selectedOptions && selectedOptions[0].getAttribute("_type")) || "",
      value: e && e.target && e.target.value,
    };
    this.setState({ ...this.state });
  }

  handleOperands(condition, operandKey, e) {
    let selectedOptions = e.target.selectedOptions;
    condition[operandKey] = {
      value: e.target.value,
      type:
        (selectedOptions &&
          selectedOptions[0] &&
          selectedOptions[0].getAttribute("_type")) ||
        "",
    };
    this.setState({ ...this.state });
  }

  showOperator1(condition) {
    return (
      (condition.operator1 && condition.operator1.value) ||
      condition.operand1.value
    );
  }

  showOperand2(condition) {
    return (
      ((condition.operand2 && condition.operand2.value) ||
        (condition.operator1 && condition.operator1.type === "binary")) &&
      condition.operator1.type !== "comparator"
    );
  }

  showOperator2(condition) {
    return (
      ((condition.operator2 && condition.operator2.value) ||
        (condition.operand2 && condition.operand2.value)) &&
      condition.operator1.type !== "comparator"
    );
  }

  showOperand3(condition) {
    return (
      (condition.operand3 && condition.operand3.value) ||
      (condition.operator1 && condition.operator1.type === "comparator") ||
      (condition.operator2 && condition.operator2.value)
    );
  }

  returnQueryTemplate(condition) {
    const { masterVariables, masterOperators } = this.props;
    switch (condition.operator1.type) {
      case "range":
        return (
          <span>
            <span className="box">
              <input
                type="text"
                placeholder={"Enter Lower Limit"}
                onChange={(e) => {
                  condition.lowerLimitValue = e.target.value;
                  this.setState({ ...this.state });
                }}
                value={condition.lowerLimitValue}
              />
            </span>
            <span className="box">
              <b>{"&"}</b>
            </span>
            <span className="box">
              <input
                type="text"
                placeholder={"Enter Higher Limit"}
                onChange={(e) => {
                  condition.higherLimitValue = e.target.value;
                  this.setState({ ...this.state });
                }}
                value={condition.higherLimitValue}
              />
            </span>
          </span>
        );

      case "comparator":
        {
          /** Operand 3 ************* */
        }
        return (
          this.showOperand3(condition) && (
            <input
              type={"text"}
              placeholder={"Enter Value"}
              value={condition.operand3 && condition.operand3.value}
              onChange={(e) => this.handleOperands(condition, "operand3", e)}
            />
          )
        );

      case "binary":
        return (
          <span>
            {/* Operand 2 ----------*/}
            {this.showOperand2(condition) && (
              <select
                class="form-control"
                id="sel1"
                onChange={(e) => this.handleOperands(condition, "operand2", e)}
              >
                <option
                  disabled
                  selected={!condition.operand2 || !condition.operand2.value}
                  value
                >
                  -- Select an option --{" "}
                </option>
                {masterVariables.map((_var) => (
                  <option
                    _type={_var.type}
                    selected={
                      _var.value ===
                        (condition.operand2 && condition.operand2.value) ||
                      false
                    }
                  >
                    {_var.value}
                  </option>
                ))}
              </select>
            )}

            {/* Operator 2 ----------------------------*/}
            {this.showOperator2(condition) && (
              <select
                class="form-control"
                id="sel1"
                onChange={(e) =>
                  this.handleOperators(condition, "operator2", e)
                }
              >
                <option
                  disabled
                  selected={!condition.operator2 || !condition.operator2.value}
                  value
                >
                  -- select an operator --{" "}
                </option>
                {masterOperators
                  .filter((op) => op.type === "comparator")
                  .map((_var) => (
                    <option
                      type={_var.type}
                      selected={
                        _var.value ===
                        (condition.operator2 && condition.operator2.value)
                      }
                    >
                      {_var.value}
                    </option>
                  ))}
              </select>
            )}

            {/** Operand 3 ************* */}
            {this.showOperand3(condition) && (
              <input
                type={"text"}
                placeholder={"Enter Value"}
                value={condition.operand3 && condition.operand3.value}
                onChange={(e) => this.handleOperands(condition, "operand3", e)}
              />
            )}
          </span>
        );
    }
  }

  returnConditions(conditions) {
    const { masterVariables, masterOperators } = this.props;
    console.log(masterVariables);
    return (
      <div className={"groupConditions"}>
        {conditions.map((condition, index) => {
          return (
            <div>
              <span className="dottedHorizonalGrid" />
              {condition.type === "standalone" ? (
                <div className="conditionRow">
                  {/* Operand 1 --------------------*/}
                  {condition.operand1 && (
                    <select
                      class="form-control"
                      id="sel1"
                      onChange={(e) =>
                        this.handleOperands(condition, "operand1", e)
                      }
                    >
                      <option
                        disabled
                        selected={
                          !condition.operand1 || !condition.operand1.value
                        }
                        value
                      >
                        -- select an option --{" "}
                      </option>
                      {masterVariables &&
                        masterVariables.map((_var) => (
                          <option _type={_var.type}>{_var.value}</option>
                        ))}
                    </select>
                  )}

                  {/* operator 1----------*/}
                  {this.showOperator1(condition) && (
                    <select
                      class="form-control"
                      id="sel1"
                      onChange={(e) => {
                        this.handleOperators(condition, "operator1", e);
                        this.setState({ ...this.state }, () => {
                          this.resetFields(condition);
                        });
                      }}
                    >
                      <option
                        disabled
                        selected={
                          !condition.operator1 || !condition.operator1.value
                        }
                        value
                      >
                        -- select an operator --{" "}
                      </option>
                      {masterOperators.map((_var) => (
                        <option
                          _type={_var.type}
                          selected={
                            _var.value ===
                              (condition.operator1 &&
                                condition.operator1.value) || false
                          }
                        >
                          {_var.value}
                        </option>
                      ))}
                    </select>
                  )}

                  {condition &&
                    condition.operator1 &&
                    condition.operator1.value &&
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

                    <span>
                      <span className="box">
                        <span className="tooltip">
                          <ApartmentOutlined
                            className="icon"
                            onClick={() =>
                              this.addCondition(condition.conditions)
                            }
                          />
                          <span class="tooltiptext">Add Condition</span>
                        </span>
                      </span>

                      <span className="box">
                        <span className="tooltip">
                          <GroupOutlined
                            className="icon"
                            onClick={() => this.addGroup(condition.conditions)}
                          />
                          <span class="tooltiptext">Add Group</span>
                        </span>
                      </span>
                    </span>

                    <CloseOutlined
                      className={"closeIcon"}
                      style={{ float: "right" }}
                      onClick={() => {
                        conditions.splice(index, 1);
                        this.setState({ ...this.state });
                      }}
                    />
                  </div>
                  {condition.conditions &&
                    condition.conditions.length > 0 &&
                    this.returnConditions(condition.conditions)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  getComparatorOperators(operators) {
    return operators.filter((operator) => operator.type === "comparator");
  }

  getBinaryoperators(operators) {
    return operators.filter((operator) => operators.type === "binary");
  }

  addCondition(conditions) {
    let lastElement = conditions && conditions[conditions.length - 1];
    let previousPageId = lastElement && lastElement["id"] || 0;
    conditions.push({
      id: previousPageId + 1,
      type: "standalone",
      operand1: {
        type: "Number",
        value: null,
      },
      operator1: {
        type: "Number",
        value: null,
      },
      operand2: null,
      operator2: null,
      operand3: null,
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

  selectOperator(group, value) {
    group.selectedOperator = value;
  }

  saveData() {
    console.log(this.state);
  }
}

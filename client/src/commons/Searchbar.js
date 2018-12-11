import React from "react";
import classnames from "classnames";

export default ({
  name,
  value,
  onSearch,
  onChange,
  isSearching = false,
  onNew
}) => {
  return (
    <form onSubmit={onSearch} style={{ margin: "16px 0px" }}>
      <div className="columns">
        <div className="column">
          <div
            className="field has-addons"
            style={{ justifyContent: "flex-end" }}
          >
            <div className="control">
              <input
                name={name}
                className="input is-small"
                type="text"
                placeholder="Search Keyword"
                value={value}
                onChange={onChange}
              />
            </div>
            <div className="control">
              <button
                className={classnames("button is-info is-small", {
                  "is-loading": isSearching
                })}
              >
                Search
              </button>
            </div>
            <div className="control">
              <a onClick={onNew} className={classnames("button is-small", {})}>
                New
              </a>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

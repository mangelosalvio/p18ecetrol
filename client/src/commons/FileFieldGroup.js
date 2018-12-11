import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const FileFieldGroup = ({
  label,
  error,
  name,
  onChange,
  placeholder,
  disabled,
  inputRef,
  onUpload,
  file,
  isLoading = false
}) => (
  <div className="field">
    <label className="label">{label}</label>
    <div className="control">
      <div className="columns">
        <div className="column">
          <input
            className={classnames("input", {
              "is-danger": error
            })}
            id={name}
            name={name}
            type="file"
            ref={inputRef}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
          />

          {error && (
            <p
              className={classnames("help", {
                "is-danger": error
              })}
            >
              {error}
            </p>
          )}
        </div>
        {file instanceof File && (
          <div className="column is-1">
            <button
              className={classnames("button is-primary", {
                "is-loading": isLoading
              })}
              onClick={onUpload}
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

FileFieldGroup.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  inputRef: PropTypes.func
};

FileFieldGroup.defaultProps = {
  text: "text"
};

export default FileFieldGroup;

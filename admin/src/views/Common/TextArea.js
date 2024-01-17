import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TextArea = ({ field, value, label, error, type, onChange, checkUserExists, rows }) => {
  return (
    <div className={classnames('form-group', { 'has-error': error })}>
      <label className="control-label">{label}</label>
      <textarea
        onChange={onChange}
        onBlur={checkUserExists}
        value={value}
        type={type}
        name={field}
        className="form-control blacktext"
        rows={rows}
      >
      </textarea>
    {error && <span className="help-block">{error}</span>}
    </div>  );
}
TextArea.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rows: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checkUserExists: PropTypes.func
}

TextArea.defaultProps = {
  type: 'text',
  rows: '3'
}

export default TextArea;

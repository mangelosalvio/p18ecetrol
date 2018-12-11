import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import isEmpty from '../validation/is-empty';

const TextAreaGroup = ({
    label,
    error,
    name,
    type,
    value,
    onChange,
    placeholder,
    disabled,
    inputRef
}) => (
    <div className='field'>
        <label className="label">{label}</label>
            <div className="control">
                <textarea 
                    className={classnames('input', {
                        'is-danger' : error 
                    })} 
                    style={{height : '5rem'}}
                    id={name}
                    name={name}
                    type={type} 
                    value={ isEmpty(value) ? '' : value} 
                    ref={inputRef}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled} />
                    
                { error && (
                    <p className={classnames('help',{
                        'is-danger' : error
                    })}>{error}</p>
                ) }
                
            </div>
    </div>
);

TextAreaGroup.propTypes = {
    label : PropTypes.string.isRequired,
    error : PropTypes.string,
    name : PropTypes.string,
    type : PropTypes.string,
    placeholder : PropTypes.string,
    disabled : PropTypes.bool,
    onChange : PropTypes.func,
    inputRef : PropTypes.func
}

TextAreaGroup.defaultProps = {
    text : 'text'
};

export default TextAreaGroup;
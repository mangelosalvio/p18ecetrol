import React, { Component } from 'react'
import PropTypes from 'prop-types';
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import classnames from 'classnames'
import DatePicker from 'react-date-picker'



export default class DatePickerFieldGroup extends Component {
  state = {
    focusedInput : false
  }

  render() {
    return (
      <div className='field'>
        <label className='label'>{this.props.label}</label>
        <div className='control'>
            <DatePicker
              onChange={this.props.onChange}
              value={this.props.date}
            />
            { this.props.error && (
                <p className={classnames('help',{
                    'is-danger' : this.props.error
                })}>{this.props.error}</p>
            ) }
        </div>
    </div>
    )
  }
}

DatePickerFieldGroup.propTypes = {
  label : PropTypes.string.isRequired,
  error : PropTypes.string,
  onChange : PropTypes.func.isRequired,
  id : PropTypes.string,
}

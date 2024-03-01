import React, { Component } from "react";

class CustomSelect extends Component {
  render() {
    const {
      title,
      disabled,
      options,
      value,
      onChange,
      style,
      // ...rest
    } = this.props;

    return (
      <div>
        {/* <input className="form-control" list="temp-select" /> */}
        <select
          id="temp-select"
          className="form-control Select-color"
          style={style}
          disabled={disabled}
          value={value}
          clearable={true}
          onChange={(e) => {
            onChange(options.filter(x => { return x.value === e.target.selectedOptions[0].value })[0])
          }}
        >
          <option value={null}>Select...</option>
          {
            options.map((option, key) => {
              return (
                <option
                  key={key}
                  // selected={option.value === value ? true : false}
                  value={option.value}
                >{option.label}</option>
              )
            })
          }
        </select>
      </div >
    )
  }
}

export default CustomSelect;

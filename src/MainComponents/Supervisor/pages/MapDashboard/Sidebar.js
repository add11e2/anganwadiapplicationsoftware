import React, { Component } from "react";

export class Sidebar extends Component {
  render() {
    return (
      <aside className={this.props.activeClass}>
        <label className="search-label" htmlFor="search">
          Search Anganwadi: <br />
          <input
            id="search"
            type="text"
            name="search"
            aria-label="Search"
            placeholder="Search Anganwadi"
            value={this.props.value}
            onChange={() => {
              this.props.filterList();
              this.props.filteredMarkers();
            }}
          />
        </label>

        <nav className="location-list">
          <ul>
            {this.props.items.map(item => {
              //   console.log(item.awcplace);
              return (
                <li key={item.anganwadicode}>
                  <a
                    id="awcname"
                    className="nav-item"
                    tabIndex="0"
                    role="button"
                    onClick={e => this.props.onListClick(e.target)}
                    onKeyPress={e => this.props.onListClick(e.target)}
                  >
                    {item.awcplace ? item.awcplace : "Not available"}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    );
  }
}

export default Sidebar;

import { Component } from "react";
const countries = require("../static/iso.json");

class Dropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            term: "",
            allCountries: countries,
            resultCountries: []
        }

        this.searchTermChange = this.searchTermChange.bind(this);
        this.getSearchTermResults = this.getSearchTermResults.bind(this);
    }

    searchTermChange(e) {
        const term = e.target.value;
        const results = term.length === 0 ? [] : this.getSearchTermResults(term);

        this.setState(({
            term: term,
            resultCountries: results
        }));
    }

    getSearchTermResults(term) {
        const lowerCaseTerm = term.toLowerCase();
        let results = [];
        
        for (let i = 0; i < this.state.allCountries.length; i++) {
            if (this.state.allCountries[i].name.toLowerCase().includes(lowerCaseTerm)
                || ((lowerCaseTerm.length <= 2) && this.state.allCountries[i]["alpha-2"].toLowerCase().includes(lowerCaseTerm))
                || ((lowerCaseTerm.length <= 3) && this.state.allCountries[i]["alpha-3"].toLowerCase().includes(lowerCaseTerm))
                || ((lowerCaseTerm.length <= 3) && this.state.allCountries[i].numeric.includes(lowerCaseTerm))
            ) {
                results.push(this.state.allCountries[i]);
                continue;
            }
        }

        return results;
    }

    renderSearchResults() {
        let returnValue = [];

        for (let i = 0; i < this.state.resultCountries.length; i++) {
            returnValue.push(<div key={"resut_" + i} onClick={
                () => {
                    this.props.addToResults(this.state.resultCountries[i])
                    this.setState(({
                        term: "",
                        resultCountries: []
                    }));                    
                }
            }>
                { this.state.resultCountries[i].name }
            </div>)
        }

        return returnValue;
    }

    componentDidMount() {
        console.log(this.state.allCountries);
    }

    render() {
        return(
            <div className="searchResultsWrapper">
                <input onChange={this.searchTermChange} value={this.state.term}></input>
                <div className="searchResults">
                    { this.renderSearchResults() }
                </div>                
            </div>
        )
    }
}

export default Dropdown;
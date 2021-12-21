import { Component } from "react";
import "./style/App.css";
import Dropdown from "./components/Dropdown";

const countries = require("./static/iso.json");

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allCountries: countries,
            results: [],
            result: "[]",
            resultMode: "json",
            invert: false
        }

        this.addToResults = this.addToResults.bind(this);
    }

    addToResults(item) {
        if (this.state.results.indexOf(item) !== -1) {
            return;
        }

        this.setState(state => ({
            results: [...state.results, item]
        }))
    }

    removeFromResults(index) {
        let newResults = [...this.state.results];
        newResults.splice(index, 1);

        this.setState(({
            results: newResults
        }))        
    }

    getInvertedResults() {
        let invertedResults = [];
        for (let i = 0; i < this.state.allCountries.length; i++) {
            let found = false;

            for (let j = 0; j < this.state.results.length; j++) {
                if (this.state.allCountries[i].name === this.state.results[j].name) {
                    found = true;
                }
            }

            if (!found) {
                invertedResults.push(this.state.allCountries[i]);
            }
        }

        return invertedResults;
    }

    renderResultCountries() {
        let returnValue = [];

        for (let i = 0; i < this.state.results.length; i++) {
            returnValue.push(<div>
                <img src={require("./style/icons/close.png")} alt="close" onClick={() => this.removeFromResults(i)} /> 
                { this.state.results[i].name } 
            </div>)    
        }

        return returnValue;
    }

    renderResultValue() {
        let results = this.state.results;
        if (this.state.invert) {
            results = this.getInvertedResults();
        }

        switch(this.state.resultMode) {
            case "json":
                this.renderResultTextJSON(results)
                break;
            case "arrayNames":
                this.renderResultTextArray(results, "name")
                break;
            case "arrayTwo":
                this.renderResultTextArray(results, "alpha-2")
                break;
            case "arrayThree":
                this.renderResultTextArray(results, "alpha-3")
                break;
            default:
                this.renderResultTextJSON(results)
        } 
    }

    renderResultTextJSON(results) {
        const result = JSON.stringify(results, null, 4);

        this.setState(state => ({
            result: result
        }))
    }  

    renderResultTextArray(results, fieldName = "alpha-2") {
        let result = []

        for (let i = 0; i < results.length; i++) {
            result.push(results[i][fieldName])
        }

        this.setState(state => ({
            result: JSON.stringify(result)
        }))
    }  

    renderContact() {
        return (
            <div className="contact">                    
                <div><a href="https://predyy.io">predyy.io</a></div>
                <div><a href="mailto:predyy@protonmail.com">predyy@protonmail.com</a></div>
                <div>© {new Date().getFullYear()}</div>
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.results !== this.state.results || prevState.resultMode !== this.state.resultMode || prevState.invert !== this.state.invert) {
            this.renderResultValue();
        }
    }

	render() {
        return (<div className="colWrapper">
            <div className="mainCol leftCol">                
                <h1>Find country</h1>
                <Dropdown addToResults={this.addToResults} />

                {this.renderContact()}                
            </div>
            <div className="mainCol rightCol">
                <h2>Filtered countries</h2>
                <div className="filteredCountriesWrapper">
                    { this.renderResultCountries() }
                </div>
                
                
                <h2>Output</h2>
                <div className="buttonWrapper">
                    <div className={"button " + (this.state.invert ? "buttonActive" : "")} onClick={() => {this.setState(state => ({invert: !state.invert}))}}>
                        Invert results
                    </div>

                    <h3>Output type</h3>
                    <div className={"button " + (this.state.resultMode === "json" ? "buttonActive" : "")} onClick={() => {this.setState(({resultMode: "json"}))}}>
                        Array of JSON objects
                    </div>

                    <div className={"button " + (this.state.resultMode === "arrayNames" ? "buttonActive" : "")} onClick={() => {this.setState(({resultMode: "arrayNames"}))}}>
                        Names array
                    </div>

                    <div className={"button " + (this.state.resultMode === "arrayTwo" ? "buttonActive" : "")} onClick={() => {this.setState(({resultMode: "arrayTwo"}))}}>
                        Alpha-2 codes array
                    </div>

                    <div className={"button " + (this.state.resultMode === "arrayThree" ? "buttonActive" : "")} onClick={() => {this.setState(({resultMode: "arrayThree"}))}}>
                        Alpha-3 codes array
                    </div>
                </div>
                
                <h2>Result</h2>
                <div>
                    <textarea readOnly value={this.state.result}></textarea>
                </div>                
            </div>
        </div>);
    }
}

export default App;
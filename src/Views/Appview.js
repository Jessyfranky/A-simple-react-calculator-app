import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import Button from "../Components/Button";

 var Parser = require('expr-eval').Parser;

class Appview extends React.Component{
    state = { 
        fullText: '0',
        resultText: '',
        isResultClicked: false,
        isResultnvalid: false
    }
    digitClicked = (digit) => {
        if(this.state.isResultClicked){
            this.setState({ fullText : digit.toString(), resultText : '', isResultClicked: false})
        }else{
            let{fullText} = this.state;
            if(fullText === "0."){
            }else if(parseFloat(fullText) === 0){
                fullText = "";
            }
            fullText = fullText + digit.toString();
            this.setState({fullText})

            
        }
    }

    operationClick = (operationSign) =>{
        let{fullText, resultText} = this.state
        console.log('resultText', resultText)
        if(resultText.length > 0){
            this.setState({
                fullText : resultText + operationSign,
                isResultClicked: false
            });
            this.setState({
                resultText : '',
            });
        } else{
            fullText = fullText + operationSign;
            this.setState({fullText })
        }
    }
    functionalButtonClick = (key) => {
        let {fullText, resultText} = this.setState;
        switch (key) {
            case 'AC':
            this.setState({ fullText : "0", resultText : ""});
            break;

            case "C":
                this.setState({resultText : ""});
                if(fullText.length > 0){
                    let newFullText = fullText.slice(0, -1);
                    if(newFullText == ""){
                        newFullText = "0";
                    }
                    this.setState({fullText : newFullText})
                }

                break;

                    case "CUT_FIRST":
                    this.setState({resultText : ""});
                    if(fullText.length > 0){
                        let newFullText = fullText.substring(1);
                        if(newFullText == ""){
                            newFullText = "0";
                        }
                        this.setState({fullText : newFullText});
                    }
                    break;

                    case "MC":
                        localStorage.setItem('CALC_M', "0")
                        break;

                        case "MR":
                            let memValue = localStorage.getItem('CALC_M') || "0";
                            let newFullText = memValue;
                            this.setState({fullText : newFullText, resultText: ''})
                            break;

                            case "M+":
                                let getMemoryValue = parseFloat(localStorage.getItem('CALC_M') || "0")
                                let totalResult = parseFloat(resultText.length > 0 ? resultText : "0") + getMemoryValue;
                                localStorage.setItem('CALC_M', totalResult.toString());
                                break;

                                
                                case "M-":
                                    let memValue2 = parseFloat(localStorage.getItem('CALC_M') || "0")
                                    let totalResult2 = parseFloat(resultText.length > 0 ? resultText : "0") - memValue2;
                                    localStorage.setItem('CALC_M', totalResult2.toString());
                                    break;

                                case "1/x":
                                    try{
                                        let fullTextNew = "(1/("+fullText+"))"
                                        let finalResult = this.parseCalculate(fullTextNew);
                                        this.setState({fullText: fullTextNew, resultText : finalResult.toString()});
                                    } catch(error){
                                        this.setState({fullText: "", resultText : ""})
                                    }
                                    break;

                                case "x^2":
                                  try{  
                                    let fullTextNew = "("+fullText+")^2"
                                    let finalResult = this.parseCalculate(fullTextNew);
                                    this.setState({fullText: fullTextNew, resultText : finalResult.toString()});
                                } catch(error){
                                    this.setState({fullText: "", resultText : ""})
                                }
                                break;

                                case "+-":
                                    try{
                                        let fullTextNew = "-("+fullText+")";
                                        this.setState({fullText: fullTextNew, resultText: ""})
                                    } catch(error){
                                        this.setState({fullText: "", resultText : ""})
                                    }
                                    break;
                                
                                case "SQ_ROOT":
                                    try{
                                        let finalResult = this.parseCalculate(fullText);
                                        finalResult = Math.sqrt(finalResult);
                                        let fullTextNew = "√("+fullText+")";
                                        this.setState({fullText: fullTextNew, resultText : finalResult.toString(), isResultInvalid: false})
                                    }catch(error){
                                        this.setState({fullText: "", resultText : "invalid", isResultInvalid : true});
                                    }
                                    break;
                                
                                default:
                                    break;
                                    


        }
    }

    equalClick = () => {
        try{
            let finalResult = this.parseCalculate(this.state.fullText)
            this.setState({resultText: finalResult.toString(), isResultClicked : true, isResultInvalid : false});
        } catch (error) {
            console.log('error', error)
            let resultText = "invalid";
            this.setState({resultText, isResultClicked : true, isResultInvalid : true})
        }
    }
    parseCalculate = (fullText) => {
        let finalResult = 0
        finalResult = Parser.evaluate(fullText)
        return finalResult;
    }

    checkKeyboardEvent = (event) =>{
        if(event.key === "0" || event.key === "1"  || event.key === "2" || event.key === "3" || event.key === "4"  || event.key === "5" || event.key === "6" || event.key === "7" || event.key === "" || event.key === "9" ){
            this.digitClicked(parseInt(event.key))
        } else if(event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/"){
            return this.operationClick(event.key)
        } else if(event.key === "="){
            this.equalClick();
        }else if (event.key === "Backspace"){
            this.functionalButtonClick("C")
        }else if(event.key === "Enter"){
            this.equalClick();
        }
       
    }
    componentDidMount(){
        document.addEventListener("keydown", this.checkKeyboardEvent, false);
        localStorage.setItem('CALC_M', localStorage.getItem('CALC_M') || "0")
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.checkKeyboardEvent, false)
    }
    printResultTextCSS = () => {
        let css = "resultArea";
        let {fullText, resultText} = this.state;
        let totalLength = fullText.length + resultText.length;
        if(totalLength >= 0 && totalLength <= 18){
            css = css + "resultArea-md";
        } else if(totalLength > 18 && totalLength <= 35){
            css = css + "resultArea-sm";
        }else if(totalLength > 35 && totalLength <= 55){
            css = css + "resultArea-xsm";
        } else{
            css = css + "resultArea-xxsm";
        }
        return css
    }
    render(){
        const {fullText, resultText, isResultInvalid} = this.state;
        return(
            <div className="App">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="app-header">
                            <span className="app-title">AJ</span> Calculator
                            <span className="badge badge-warning">React<small>js</small></span>
                        </div>

                        <div className="calculatorArea">
                            <div className="row">
                                <div className="col-md-12 calculator-header-part">
                                    <div className={this.printResultTextCSS()}>
                                        {fullText}
                                        {isResultInvalid && resultText.length > 0 && <span className="text-danger">
                                            {' = ' + resultText}
                                            </span>
                                        }
                                        { !isResultInvalid && resultText.length > 0 &&<span className="text-success">
                                            {' = ' + resultText}
                                            </span>
                                            }
                                    </div>
                                </div>
                                <div className="col-md-12 calculator-body-part">
                                    <div className="row justify-content-center">
                                        <Button isIcon={'fa fa-undo'} buttonClass="btn btn-primary top-button" onClick={this.undoClick}/>
                                        <Button buttonClass="btn btn-primary top-button" IsIcon={'fa fa-arrow-left'} onClick={() => this.functionalButtonClick("CUT_FIRST")}/>
                                        <Button buttonClass="btn btn-primary top-button  text-bold" onClick={() => this.functionalButtonClick("C")} textValue="C"/>
                                        <Button buttonClass="btn btn-primary top-button  text-bold" onClick={() => this.functionalButtonClick("AC")} textValue="AC"/>
                                    </div>
                                    <div className="row justify-content-center mt-2">
                                        <Button buttonClass="btn btn-success btn-mem  text-bold"  onClick={() => this.functionalButtonClick('MC')} textValue="mc"/>
                                        <Button buttonClass="btn btn-success btn-mem  text-bold"  onClick={() => this.functionalButtonClick("M+")} textValue="m+"/>
                                        <Button buttonClass="btn btn-success btn-mem  text-bold"  onClick={() => this.functionalButtonClick("M-")} textValue="m-"/>
                                        <Button buttonClass="btn btn-success btn-mem  text-bold"  onClick={() => this.functionalButtonClick("MR")} textValue="mr"/>
                                    </div>
                                    <div className="row justify-content-center mt-2">
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.digitClicked('7')} textValue="7"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold" onClick={() => this.digitClicked('8')} textValue="8"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.digitClicked('9')} textValue="9"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.operationClick('/')} textValue="/"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.functionalButtonClick('SQR_ROOT')} textValue="√"/>
                                    </div>
                                    <div className="row justify-content-center mt-2">
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.digitClicked('4')} textValue="7"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold" onClick={() => this.digitClicked('5')} textValue="5"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.digitClicked('6')} textValue="6"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.operationClick('*')} textValue="x"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.functionalButtonClick('x^2')} textValue="x^2"/>
                                    </div>
                                    <div className="row justify-content-center mt-2">
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.digitClicked('1')} textValue="1"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold" onClick={() => this.digitClicked('2')} textValue="2"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.digitClicked('3')} textValue="3"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.operationClick('-')} textValue="-"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.functionalButtonClick('1/x')} textValue="1/x"/>
                                    </div>
                                    <div className="row justify-content-center mt-2">
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-digit  text-bold"  onClick={() => this.digitClicked('0')} textValue="0"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-operation  text-bold" onClick={() => this.dotClick()} textValue="."/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-operation  text-bold"  onClick={() => this.functionalButtonClick('+-')} textValue="+-"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-operation  text-bold"  onClick={() => this.operationClick('+')} textValue="+"/>
                                        <Button buttonClass="btn btn-primary btn-digit-operation btn-equal  text-bold"  onClick={() => this.equalClick()} textValue="="/>
                                    </div>
                                    

                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



export default Appview
import './App.css';
import DigitButton from './DigitButton';
import { useReducer } from 'react';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit', 
  CLEAR: 'clear',
  CHOOSE_OPERATION: "choose-operation",
  DELETE_DIGIT: 'delete-digit', 
  EVALUATE: 'evaluate'
}
function reducer (state , {type , payload}){
  switch(type) {
    case ACTIONS.ADD_DIGIT: 
    if(state.overwrite){
      return{
        ...state, 
        currentOpperand: payload.digit, 
        overwrite: false
      }
    }
    if (payload.digit === "0" && state.currentOpperand === "0") return state
    if (payload.digit === "." && state.currentOpperand.includes(".")) return state
    return {
      ...state, 
      currentOpperand: `${state.currentOpperand || ""}${payload.digit}`,
    }
    case ACTIONS.CHOOSE_OPERATION: 
    if(state.currentOpperand == null && state.previousOpperand == null){
      return state
    }
    if(state.previousOpperand == null){
      return{
        ...state, 
        operation: payload.operation,
        previousOpperand: state.currentOpperand, 
        currentOpperand: null
      }
    }
    if(state.currentOpperand == null){
      return{
        ...state, 
        operation: payload.operation
      }
    }
    return{
      ...state, 
      previousOpperand: evaluate(state),
      operation: payload.operation,
      currentOpperand: null
    }
    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.EVALUATE:
       if(state.operation == null || state.currentOpperand == null || state.previousOpperand == null){
        return state
       }
       return {
        ...state, 
        overwrite: true,
        previousOpperand: null, 
        operation: null, 
        currentOpperand: evaluate(state),
       }
    case ACTIONS.DELETE_DIGIT: 
       if(state.overwrite){
         return{
          ...state, 
          overwrite: false, 
          currentOpperand: null
         }
      }
      if(state.currentOpperand == null) return {}
      if(state.currentOpperand.lenght === 1){
        return{
          ...state, currentOpperand: null
        }
      }
      return{
        ...state,
        currentOpperand: state.currentOpperand.slice(0, -1)
      }
  }
}
function evaluate ({ currentOpperand, previousOpperand, operation }){
  const prev = parseFloat(previousOpperand)
  const current = parseFloat(currentOpperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
      case "*":
        computation = prev * current
        break
      case "/":
    computation = prev / current
    break
  }
  return computation.toString()
}
function App() {
  const [{ currentOpperand,  previousOpperand, operation }, dispatch] = useReducer(reducer, {})
  return (
    <div className="App">
      <div className='calculator_grid'>
        <div className='output'>
        <div className='previous_operand'> {previousOpperand} {operation}</div> 
          <div className='current_operand'> {currentOpperand}  </div> 
        </div>
        <button className='span_two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})} >DEL</button>
        <OperationButton dispatch={dispatch} operation="/"/>
        <DigitButton dispatch={dispatch} digit="1"/>
        <DigitButton dispatch={dispatch} digit="2"/>
        <DigitButton dispatch={dispatch} digit="3"/>
        <OperationButton dispatch={dispatch} operation="*" />
        <DigitButton dispatch={dispatch} digit="4"/>
        <DigitButton dispatch={dispatch} digit="5"/>
        <DigitButton dispatch={dispatch} digit="6"/>
        <OperationButton dispatch={dispatch} operation="+" /> 
        <DigitButton dispatch={dispatch} digit="7"/>
        <DigitButton dispatch={dispatch} digit="8"/>
        <DigitButton dispatch={dispatch} digit="9"/>
        <OperationButton dispatch={dispatch} operation="_" />
        <DigitButton dispatch={dispatch} digit="0"/>
        <DigitButton dispatch={dispatch} digit="."/>
        <button className='span_two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
      </div>
    </div>
  );
}

export default App;

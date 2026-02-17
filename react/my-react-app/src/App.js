import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// const App = () => {
//   let Name = "Kenny"
//   let Occupation = "Creative Designer"

//   return <div>My name is {Name}. I am a {Occupation} </div>
// }

const App = () => {
  const fruits = ['Orange', 'Banana', 'Apple', 'Grape', 'Watermelon', 'Strawberry', 'Pineapple' ];
  

  const fruitItems = fruits.map(fruit => {
    return <li key={fruit}>{fruit}</li>
  });

    function newFruit () {
    fruitItems = fruits.push("New Fruit")

    return fruitItems
  }

  return <section>
      <ol>{fruitItems}</ol>

      <button onClick={(event) => {fruits.push("New Fruit"); console.log(fruitItems);}}>
        I am a button
      </button>

   

      
  </section>



}

export default App;

import logo from './logo.svg';
import './App.css';
import React, { Fragment, useState, useEffect, useRef, useReducer } from "react";

function App() {

    const gradientReducer = (state, action) => {
        switch (action.type) {
        case "FETCH_INIT":
            return {
                ...state,
                loading: true,
                error: ""
            };
        case "FETCH_SUCCESS":
            function allTags(list) {
                let listTotal = [];
                for (let element of list) {
                    if ("tags" in element) {
                        listTotal = listTotal.concat(element.tags);
                    }
                }
                const listTagsUnique = [];
                listTotal.forEach((el) => {
                    if (!listTagsUnique.includes(el)) {
                        listTagsUnique.push(el);
                    }
                });
                return listTagsUnique;
            }
            console.log("action.payload");
            console.log(action.payload);
            return {
                ...state,
                gradient: action.payload,
                // uniqueTag: allTags(action.payload),
                // filteredGradient: action.payload,
                loading: false,
            };
        case "FETCH_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case "FILTER":
            const filterList = (list, filter) => {
                list.filter(el => {
                    if (filter === "all") {
                        return true;
                    }
                    return el.tags.includes(filter);
                }
                           );
            };
            return {
                ...state,
                filter: action.payload,
                filteredGradient: filterList(state.gradient, action.payload),
                loading: false,
            };
        };
    };

    const [state, dispatch] = useReducer(gradientReducer, {
    loading: false,
    error: '',
    gradient: []
    });
    
    const useIsMounted = () => {
        const isMounted = useRef(false);
        useEffect(() => {
            isMounted.current = true;
            return () => (isMounted.current = false);
        }, [isMounted]);
        return isMounted;
    };
    const isMounted = useIsMounted();

    const [res, setRes] = useState({});
    
    useEffect(() => {
        dispatch({ type: "FETCH_INIT" });
        fetch(`https://gradients-api.herokuapp.com/gradients`)
            .then(response => {
                console.log("FETCH_INIT");
                console.log(response);
                if (!response.ok) {
                    throw new Error(`Something went wrong: ${response.statusText}`);
                }
                return response.json();
            })
            .then(result => {
                if (isMounted.current) {
                    // console.log("result");
                    // console.log(result);
                    // result.map(e => console.log(e.start));
                    console.log("FETCH_SUCCESS");
                    setRes(result);
                    console.log(res);
                    dispatch({ type: "FETCH_SUCCESS", payload: result });
                    console.log(state.gradient);
                }
            })
            .catch(error => {
                if (isMounted.current) {
                    dispatch({ type: "FETCH_FAILURE", payload: error.message });
                }
            });
    }, [isMounted]);

    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              result <code>res</code>.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
    );
}

export default App;
